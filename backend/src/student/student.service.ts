import { BadRequestException, Injectable } from "@nestjs/common";
import * as xlsx from "xlsx";

import { HelperService } from "src/auth/helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { StudentFile, UploadStudentType } from "./types/student.type";

@Injectable()
export class StudentService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async uploadStudents(body: UploadStudentType[], institutionId: string) {
        return this.createStudents(body, institutionId);
    }

    async uploadStudentsWithFile(
        file: Express.Multer.File,
        institutionId: string,
    ) {
        if (!file) {
            throw new BadRequestException("No file provided");
        }
        const workbook = xlsx.read(file.buffer, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows: StudentFile[] = xlsx.utils.sheet_to_json(worksheet);

        return this.createStudents(rows, institutionId);
    }
    async createStudents(students: StudentFile[], institutionId: string) {
        const role = await this.helperService.getRoleId("student");

        let insertedStudentCount = 0;
        let alreadyInsertedStudentCount = 0;

        for (const student of students) {
            const token = await this.helperService.createToken({
                tc: student.tc,
                institutionId,
            });

            const hashedPassword = await this.helperService.toHashPassword(
                student.phoneNumber1,
            );

            const auth = await this.prismaService.auth.findUnique({
                where: {
                    tc: student.tc,
                },
            });

            if (auth) {
                alreadyInsertedStudentCount += 1;
                continue;
            }

            const newAuth = await this.prismaService.auth.create({
                data: {
                    tc: student.tc,
                    phoneNumber: student.phoneNumber1,
                    password: hashedPassword,
                    accessToken: token,
                },
            });

            if (!newAuth) {
                continue;
            }

            await this.prismaService.permit.create({
                data: {
                    institutionId,
                    authId: newAuth.id,
                    roleId: role.id,
                },
            });

            const newStudent = await this.prismaService.student.create({
                data: {
                    authId: newAuth.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    tc: student.tc,
                    address: student.address,
                    phoneNumber1: student.phoneNumber1,
                    phoneNumber2: student.phoneNumber2,
                    institutionKey: student.institutionKey,
                    institutionId,
                },
            });

            await this.prismaService.parent.create({
                data: {
                    authId: newAuth.id,
                    firstName: student.parentName,
                    lastName: student.parentLastName,
                    tc: student.parentTc,
                    address: student.parentAddress,
                    phoneNumber1: student.phoneNumber1,
                    studentId: newStudent.id,
                },
            });
            insertedStudentCount += 1;
        }
        return {
            total: students.length,
            insertedStudentCount,
            alreadyInsertedStudentCount,
            message: "Students uploaded successfully",
        };
    }

    uploadStudent(student: UploadStudentType, institutionId: string) {
        return this.createStudents([student], institutionId);
    }

    async deleteStudent(id: string) {
        const student = await this.prismaService.student.findUnique({
            where: {
                id,
            },
        });

        if (!student) {
            throw new BadRequestException("Student not found");
        }

        await this.prismaService.parent.deleteMany({
            where: {
                studentId: student.id,
            },
        });

        await this.prismaService.student.delete({
            where: {
                id: student.id,
            },
        });

        if (student.authId) {
            await this.prismaService.auth.delete({
                where: {
                    id: student.authId,
                },
            });
        }

        return {
            message: "Student deleted successfully",
        };
    }
}
