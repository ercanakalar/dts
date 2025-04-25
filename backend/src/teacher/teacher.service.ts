import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { HelperService } from "src/auth/helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";

import { Teacher, TeacherUpdate } from "./types/teacher.type";

@Injectable()
export class TeacherService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async createTeacher(body: Teacher) {
        const institution = await this.prismaService.institution.findUnique({
            where: {
                id: body.institutionId,
            },
        });
        if (!institution) {
            throw new NotFoundException(
                `Institution with ID ${body.institutionId} not found`,
            );
        }

        const { accessToken, refreshToken } =
            await this.helperService.generateTokens({
                tc: body.tc,
                institutionId: institution.id,
            });

        const hashedPassword = await this.helperService.toHashPassword(body.tc);
        if (!hashedPassword) {
            throw new InternalServerErrorException("Password hashing failed");
        }
        const existingTeacher = await this.prismaService.teacher.findUnique({
            where: {
                tc: body.tc,
            },
        });
        if (existingTeacher) {
            throw new InternalServerErrorException(
                `Teacher with TC ${body.tc} already exists`,
            );
        }
        const teacherAuth = await this.prismaService.auth
            .create({
                data: {
                    tc: body.tc,
                    phoneNumber: body.phoneNumber1,
                    password: hashedPassword,
                    accessToken,
                    refreshToken,
                },
            })
            .catch(() => {
                throw new ConflictException("The teacher already exists");
            });

        await this.prismaService.teacher.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                address: body.address,
                phoneNumber1: body.phoneNumber1,
                phoneNumber2: body.phoneNumber2,
                institutionId: institution.id,
                authId: teacherAuth.id,
                tc: body.tc,
                subjectId: body.subjectId,
                experienceYear: body.experienceYear,
                institutionKey: institution.name,
            },
        });

        await this.prismaService.permit.create({
            data: {
                institutionId: institution.id,
                authId: teacherAuth.id,
                roleId: body.roleId,
            },
        });

        return {
            message: "Teacher created successfully",
        };
    }

    async updateTeacher(body: TeacherUpdate) {
        const { id, ...rest } = body;
        try {
            return await this.prismaService.teacher.update({
                where: {
                    id,
                },
                data: rest,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                throw new NotFoundException(
                    `Institution with ID ${id} not found`,
                );
            }
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    async deleteTeacher(id: string) {
        const teacher = await this.prismaService.teacher.findUnique({
            where: {
                id,
            },
        });
        if (!teacher) {
            throw new NotFoundException(`Teacher with ID ${id} not found`);
        }
        await this.prismaService.teacher
            .delete({
                where: {
                    id,
                },
            })
            .catch(() => {
                throw new InternalServerErrorException(
                    `Failed to delete teacher with ID ${id}`,
                );
            });

        await this.prismaService.auth.delete({
            where: {
                id: teacher.authId!,
            },
        });

        return {
            message: "Teacher deleted successfully",
        };
    }

    async getTeacherById(id: string) {
        return await this.prismaService.teacher.findUnique({
            where: {
                id,
            },
            include: {
                institution: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phoneNumber1: true,
                        phoneNumber2: true,
                        institutionKey: true,
                    },
                },
                object: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                classrooms: {
                    where: {
                        teacherId: id,
                    },
                    include: {
                        student: true,
                        absenteeismDetails: {
                            include: {
                                student: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        tc: true,
                                        phoneNumber1: true,
                                        phoneNumber2: true,
                                        address: true,
                                        institutionId: true,
                                        institutionKey: true,
                                        institution: {
                                            select: {
                                                id: true,
                                                name: true,
                                                address: true,
                                                phoneNumber1: true,
                                                phoneNumber2: true,
                                                institutionKey: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}
