import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import {
    CreateUser,
    GiveRole,
    LoginUser,
    UpdatePermit,
    UpdateUser,
    UserFilter,
    UserType,
} from "./types/auth.types";

import { HelperService } from "./helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async register(user: CreateUser, contextId: number) {
        const hasUser = await this.prismaService.user.findFirst({
            where: {
                OR: [{ email: user.email, username: user.username }],
            },
        });

        if (hasUser)
            throw new UnprocessableEntityException(
                "Email veya Kullanıcı Adı mevcut!",
            );

        const hash = await this.helperService.hashData(user.password);

        const newUser = await this.prismaService.user
            .create({
                data: {
                    username: user.username,
                    email: user.email,
                    password: hash,
                },
            })
            .catch(() => {
                throw new UnprocessableEntityException("Email kullaniliyor!");
            });

        this.helperService.givePermit(newUser.id, contextId);

        return {
            message: "Registered Successfully!",
            data: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            },
        };
    }

    async login(user: LoginUser) {
        const theUser = await this.findLoginUser(user).catch(() => {
            throw new UnprocessableEntityException("Email mevcut değil");
        });

        const comparePassword = await this.helperService.comparePasswords(
            user.password,
            theUser.password,
        );

        if (!comparePassword) {
            throw new UnprocessableEntityException(
                "Email veya Parola doğru değil.",
            );
        }

        const { accessToken } = await this.helperService.getTokens(theUser);

        return { accessToken };
    }

    findLoginUser(user: LoginUser) {
        return this.prismaService.user.findFirstOrThrow({
            where: {
                email: user.email,
            },
            select: {
                id: true,
                email: true,
                username: true,
                password: true,
                permit: {
                    include: {
                        role: {
                            include: {
                                rolePermission: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                        context: true,
                    },
                },
            },
        });
    }

    async getAllUsersByFilter(params: UserFilter) {
        const userWhere: Prisma.UserWhereInput = {};

        if (params.query && params.query.length > 0) {
            userWhere.username = {
                contains: params.query.trim(),
                mode: "insensitive",
            };
            userWhere.email = {
                contains: params.query.trim(),
                mode: "insensitive",
            };
        }

        if (params.disabled === "true") {
            userWhere.disabled = true;
        } else if (params.disabled === "false") {
            userWhere.disabled = false;
        }

        const queryOptions: Prisma.UserFindManyArgs = {
            where: userWhere,
            orderBy: { id: "desc" },
        };

        if (params.page != null) {
            const page = parseInt(params.page);
            const pageSize = 10;
            queryOptions.skip = page * pageSize;
            queryOptions.take = pageSize;
        }
        const users = await this.prismaService.user.findMany(queryOptions);
        const count = await this.prismaService.user.count({});

        return { users, count };
    }
    async getAllUsers() {
        const allUsers: Array<UserType> = await this.prismaService.user
            .findMany({
                where: {
                    disabled: false,
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    permit: {
                        select: {
                            id: true,
                            contextId: true,
                        },
                    },
                },
                orderBy: {
                    username: "asc",
                },
            })
            .catch(() => {
                return [];
            });

        if (allUsers.length === 0)
            throw new UnprocessableEntityException("Kullanıcı bulunamadı!");

        return {
            message: "Got all users",
            count: allUsers.length,
            data: allUsers,
        };
    }

    async getUserById(userId: number) {
        const theUser = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                username: true,
                permit: true,
            },
        });
        return {
            message: "Got the user",
            data: theUser,
        };
    }

    async validateUserWithEmail(email: string) {
        try {
            return await this.prismaService.user.findUniqueOrThrow({
                where: {
                    email,
                },
            });
        } catch {
            throw new UnprocessableEntityException(
                "Bu maili kullanan bir kullanıcı bulunamadı!",
            );
        }
    }

    async forgotPassword(email: string, password: string) {
        const hash = await this.helperService.hashData(password);
        try {
            return await this.prismaService.user.update({
                where: {
                    email,
                },
                data: {
                    password: hash,
                },
            });
        } catch {
            throw new UnprocessableEntityException("Parola güncellenemedi!");
        }
    }

    async getContexts() {
        const contexts = await this.prismaService.context.findMany({});
        return contexts;
    }

    async permissions(id: number, contextId: number) {
        const user = await this.prismaService.user
            .findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    permit: true,
                },
            })
            .catch(() => {
                throw new UnprocessableEntityException("Kullanıcı bulunamadı!");
            });
        const isMatch = user?.permit.find(
            (permit) => permit.contextId === contextId,
        );

        if (!isMatch) {
            throw new UnprocessableEntityException(
                "Bu projeye erişim izniniz bulunmamaktadır!",
            );
        }

        return user;
    }

    getAllRoles() {
        return this.prismaService.role.findMany({
            orderBy: {
                id: "asc",
            },
        });
    }

    getAllPermits() {
        return this.prismaService.permit.findMany();
    }

    async updateUser(user: UpdateUser) {
        const existingUser = await this.prismaService.user.findFirst({
            where: {
                OR: [{ username: user.username }, { email: user.email }],
                NOT: [{ id: user.id }],
            },
        });

        if (existingUser) {
            throw new UnprocessableEntityException(
                "Email veya Kullanıcı adı zaten kullanılıyor!",
            );
        }

        const data: Prisma.UserUpdateInput = {
            username: user.username,
            email: user.email,
        };

        if (user.password?.length > 0) {
            const hash = await this.helperService.hashData(user.password);
            data.password = hash;
        }

        const newUser = await this.prismaService.user
            .update({
                where: { id: user.id },
                data,
            })
            .catch(() => {
                throw new UnprocessableEntityException("Kullanıcı bulunamadı!");
            });

        return {
            message: "Updated Successfully!",
            data: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            },
        };
    }

    async giveRole(body: GiveRole) {
        const upsertRole = await this.prismaService.permit
            .upsert({
                where: {
                    userId_contextId: {
                        userId: body.user,
                        contextId: body.context,
                    },
                },
                update: {
                    roleId: body.role,
                    userId: body.user,
                },
                create: {
                    contextId: body.context,
                    roleId: body.role,
                    userId: body.user,
                },
                include: {
                    role: true,
                    context: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
            })
            .catch(() => {
                throw new UnprocessableEntityException(
                    "Kullanıcıya role ataması yapılamadı!",
                );
            });

        return {
            message: `${upsertRole.user.username} kullanıcısının Rolü: ${upsertRole.role.name} ve Yetkisi: ${upsertRole.context.name} atandı.`,
        };
    }

    async deletePermit(permitId: number) {
        const deletedPermit = await this.prismaService.permit
            .delete({
                where: {
                    id: permitId,
                },
                include: {
                    role: true,
                    context: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
            })
            .catch(() => {
                throw new UnprocessableEntityException(
                    "Kullanıcıya ait role silinemedi!",
                );
            });

        return {
            message: `${deletedPermit.user.username} kullanıcısının Rolü: ${deletedPermit.role.name} Yetkisinden: ${deletedPermit.context.name} kaldırıldı.`,
        };
    }

    async updatePermit(permitId: number, body: UpdatePermit) {
        return await this.prismaService.permit.update({
            where: {
                id: permitId,
            },
            data: {
                contextId: body.context,
            },
        });
    }

    async currentUser(id: number, contextId: number) {
        const theUser = await this.prismaService.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                email: true,
                username: true,
                permit: {
                    where: {
                        contextId,
                    },
                },
            },
        });

        return theUser;
    }

    async getPermissionsOfRole(roleId: number) {
        return await this.prismaService.rolePermission.findMany({
            where: {
                roleId,
            },
            include: {
                permission: true,
            },
        });
    }
}
