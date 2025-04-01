import { Injectable } from "@nestjs/common";
import { HelperService } from "src/auth/helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Teacher } from "./types/teacher.type";

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
}
