import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { HelperService } from "./helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUser, GiveRole, LoginUser } from "./types/auth.types";

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async createUser(user: CreateUser) {
        const hashedPassword = await this.helperService.toHashPassword(
            user.password,
        );

        const institution = await this.prismaService.institution.findFirst({
            where: {
                institutionKey: user.institutionKey,
            },
            select: {
                id: true,
            },
        });

        if (institution === null) {
            throw new NotFoundException("Kurum bulunamadı.");
        }

        const { accessToken, refreshToken } =
            await this.helperService.generateTokens({
                tc: user.tc,
                institutionId: institution.id,
            });

        const role = await this.prismaService.role.findUnique({
            where: {
                id: user.roleId,
            },
        });

        if (!role) {
            throw new NotFoundException(
                `Institution with ID ${user.roleId} not found`,
            );
        }

        const newAuth = await this.prismaService.auth
            .create({
                data: {
                    email: user.email,
                    tc: user.tc,
                    phoneNumber: user.phoneNumber,
                    password: hashedPassword,
                    accessToken,
                    refreshToken,
                },
            })
            .catch(() => {
                throw new UnauthorizedException("Bu kullanıcı zaten kayıtlı.");
            });

        await this.prismaService.permit.create({
            data: {
                institutionId: institution.id,
                authId: newAuth.id,
                roleId: user.roleId,
            },
        });

        return { accessToken, refreshToken };
    }

    async login(user: LoginUser) {
        const userWhere: Prisma.AuthWhereInput = {
            OR: [{ email: user.username }, { tc: user.username }],
        };

        const foundUser = await this.prismaService.auth.findFirst({
            where: userWhere,
            select: {
                id: true,
                email: true,
                tc: true,
                phoneNumber: true,
                password: true,
                permit: {
                    include: {
                        institution: true,
                        role: true,
                    },
                },
                accessToken: true,
                refreshToken: true,
            },
        });

        if (!foundUser) {
            throw new NotFoundException("Kullanıcı bulunamadı.");
        }

        const isPasswordMatch = await this.helperService.comparePassword(
            foundUser.password,
            user.password,
        );

        if (!isPasswordMatch) {
            throw new UnauthorizedException("Şifre yanlış.");
        }

        const { accessToken, refreshToken } =
            await this.helperService.generateTokens({
                userId: foundUser.id,
                tc: foundUser.tc,
                institutionId: foundUser.permit?.institutionId,
                permitId: foundUser.permit?.id,
            });

        await this.prismaService.auth.update({
            where: {
                id: foundUser.id,
            },
            data: {
                accessToken,
                refreshToken,
            },
        });

        return { accessToken, refreshToken };
    }

    async getUserById(id: string, institutionId: string) {
        const user = await this.prismaService.auth.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                email: true,
                tc: true,
                phoneNumber: true,
                permit: {
                    include: {
                        institution: true,
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException("Kullanıcı bulunamadı.");
        }

        const currentUserRole = await this.helperService.getRoleId("admin");

        if (
            currentUserRole.roleType !== "admin" &&
            user?.permit?.institution?.id !== institutionId
        ) {
            throw new UnauthorizedException(
                "Bu kullanıcıya erişim izniniz yok.",
            );
        }

        return user;
    }

    async giveRole(body: GiveRole) {
        const user = await this.prismaService.auth.findUnique({
            where: {
                id: body.userId,
            },
            select: {
                id: true,
                permit: {
                    select: {
                        institution: true,
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException("Kullanıcı bulunamadı.");
        }

        const role = await this.prismaService.role.findUnique({
            where: {
                id: body.roleId,
            },
            select: {
                id: true,
            },
        });

        if (!role) {
            throw new NotFoundException("Rol bulunamadı.");
        }

        await this.prismaService.auth.update({
            where: {
                id: body.userId,
            },
            data: {
                permit: {
                    update: {
                        roleId: body.roleId,
                    },
                },
            },
        });

        return { message: "Rol başarıyla verildi." };
    }

    async verifyRefreshToken(refreshToken: string) {
        const payload =
            await this.helperService.verifyRefreshToken(refreshToken);

        const user = await this.prismaService.auth.findUnique({
            where: { tc: payload.tc },
        });

        if (!user) {
            throw new UnauthorizedException("Geçersiz refresh token.");
        }

        return payload;
    }

    async updateRefreshToken(tc: string, refreshToken: string) {
        await this.prismaService.auth.update({
            where: { tc },
            data: { refreshToken },
        });
    }
}
