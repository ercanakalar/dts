import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { HelperService } from "src/auth/helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Teacher, TeacherUpdate } from "./types/teacher.type";
import { Prisma } from "@prisma/client";

@Injectable()
export class TeacherService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async createTeacher(body: Teacher, institutionId: string) {
        const teacherRole = await this.helperService.getRoleId("teacher");

        const token = await this.helperService.createToken({
            tc: body.tc,
            institutionId,
        });

        const hashedPassword = await this.helperService.toHashPassword(body.tc);

        const teacherAuth = await this.prismaService.auth.create({
            data: {
                tc: body.tc,
                phoneNumber: body.phoneNumber1,
                password: hashedPassword,
                accessToken: token,
            },
        });

        await this.prismaService.teacher.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                address: body.address,
                phoneNumber1: body.phoneNumber1,
                phoneNumber2: body.phoneNumber2,
                institutionId,
                authId: teacherAuth.id,
                tc: body.tc,
                subjectId: body.subjectId,
                experienceYear: body.experienceYear,
                institutionKey: body.institutionKey,
            },
        });

        await this.prismaService.permit.create({
            data: {
                institutionId,
                authId: teacherAuth.id,
                roleId: teacherRole.id,
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
}
