import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { HelperService } from "./helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUser, LoginUser } from "./types/auth.types";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async register(user: CreateUser) {
        const hashedPassword = await this.helperService.toHashPassword(
            user.password,
        );

        const token = await this.helperService.createToken({
            username: user.username,
        });

        await this.prismaService.auth.create({
            data: {
                username: user.username,
                password: hashedPassword,
                accessToken: token,
            },
        });

        return { accessToken: token };
    }

    async login(user: LoginUser) {
        const foundUser = await this.prismaService.auth.findFirst({
            where: {
                username: user.username,
            },
            select: {
                id: true,
                username: true,
                password: true,
                permit: {
                    include: {
                        institution: true,
                        role: true,
                    },
                },
                accessToken: true,
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

        const token = await this.helperService.createToken({
            username: foundUser.username,
        });

        await this.prismaService.auth.update({
            where: {
                id: foundUser.id,
            },
            data: {
                accessToken: token,
            },
        });

        return { accessToken: token };
    }
}
