import { BadRequestException, Injectable } from "@nestjs/common";
import * as xlsx from "xlsx";

import { HelperService } from "src/auth/helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
    Parent,
    Student,
    StudentFile,
    UpdateParent,
    UpdateStudent,
    UploadStudentType,
} from "./types/student.type";
import { Prisma } from "@prisma/client";

@Injectable()
export class StudentService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async uploadStudents(body: UploadStudentType[]) {
        return this.createStudents(body, "");
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
            const institution = await this.prismaService.institution.findUnique(
                {
                    where: {
                        id: student.institutionId ?? institutionId,
                    },
                },
            );

            if (!institution) {
                throw new BadRequestException("Institution not found");
            }

            const existInstitutionId = institution.id ?? institutionId;

            const { accessToken, refreshToken } =
                await this.helperService.generateTokens({
                    tc: student.tc,
                    institutionId: existInstitutionId,
                });

            const hashedPassword = await this.helperService.toHashPassword(
                student.phoneNumber1,
            );

            if (!hashedPassword) {
                throw new BadRequestException("Password hashing failed");
            }

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
                    accessToken,
                    refreshToken,
                },
            });

            if (!newAuth) {
                continue;
            }

            await this.prismaService.permit.create({
                data: {
                    institutionId: existInstitutionId,
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
                    institutionKey: institution.institutionKey,
                    institutionId: existInstitutionId,
                },
            });

            await this.createAbsenteeism(newStudent);

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

    uploadStudent(student: UploadStudentType) {
        return this.createStudents([student], student.institutionId);
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
                    id: student.authId!,
                },
            });
        }

        return {
            message: "Student deleted successfully",
        };
    }

    async updateStudent(body: UpdateStudent) {
        const student = await this.prismaService.student.findUnique({
            where: {
                id: body.id,
            },
        });

        if (!student) {
            throw new BadRequestException("Student not found");
        }

        const institution = await this.prismaService.institution.findUnique({
            where: {
                id: body.institutionId,
            },
        });

        if (!institution) {
            throw new BadRequestException("Institution not found");
        }

        const updatedStudent = await this.prismaService.student.update({
            where: {
                id: student.id,
            },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                tc: body.tc,
                address: body.address,
                phoneNumber1: body.phoneNumber1,
                phoneNumber2: body.phoneNumber2,
                institutionId: institution.id,
                institutionKey: institution.institutionKey,
            },
        });

        if (!updatedStudent) {
            throw new BadRequestException("Student update failed");
        }
        await this.prismaService.permit.update({
            where: {
                authId: student.authId ?? undefined,
            },
            data: {
                institutionId: body.institutionId,
            },
        });

        const hashedPassword = await this.helperService.toHashPassword(body.tc);

        await this.prismaService.auth.update({
            where: {
                id: student.authId ?? undefined,
            },
            data: {
                tc: body.tc,
                phoneNumber: body.phoneNumber1,
                password: hashedPassword,
            },
        });
        return {
            message: "Student updated successfully",
            updatedStudent,
        };
    }

    async updateParent(body: UpdateParent) {
        const parent = await this.prismaService.parent.findUnique({
            where: {
                id: body.id,
            },
        });

        if (!parent) {
            throw new BadRequestException("Parent not found");
        }

        const updatedParent = await this.prismaService.parent.update({
            where: {
                id: parent.id,
            },
            data: {
                firstName: body.parentName,
                lastName: body.parentLastName,
                tc: body.parentTc,
                address: body.parentAddress,
                phoneNumber1: body.parentNumber1,
            },
        });

        if (!updatedParent) {
            throw new BadRequestException("Parent update failed");
        }

        return {
            message: "Parent updated successfully",
            updatedParent,
        };
    }

    async crateParent(body: Parent) {
        const student = await this.prismaService.student.findUnique({
            where: {
                id: body.studentId,
            },
        });

        if (!student) {
            throw new BadRequestException("Student not found");
        }

        const { accessToken, refreshToken } =
            await this.helperService.generateTokens({
                studentId: student.id,
                tc: body.tc,
                institutionId: student.institutionId,
            });

        const hashedPassword = await this.helperService.toHashPassword(body.tc);

        if (!hashedPassword) {
            throw new BadRequestException("Password hashing failed");
        }

        const auth = await this.prismaService.auth.findUnique({
            where: {
                tc: body.tc,
            },
        });

        if (auth) {
            throw new BadRequestException("Parent already exists");
        }

        const newAuth = await this.prismaService.auth.create({
            data: {
                tc: body.tc,
                phoneNumber: body.phoneNumber1,
                password: hashedPassword,
                accessToken,
                refreshToken,
            },
        });

        if (!newAuth) {
            throw new BadRequestException("Parent creation failed");
        }

        await this.prismaService.permit.create({
            data: {
                institutionId: student.institutionId,
                authId: newAuth.id,
                roleId: body.roleId,
            },
        });

        const parent = await this.prismaService.parent.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                tc: body.tc,
                address: body.address,
                phoneNumber1: body.phoneNumber1,
                studentId: student.id,
                authId: newAuth.id,
            },
        });

        return {
            message: "Parent created successfully",
            parent,
        };
    }

    async getStudentById(id: string) {
        const student = await this.prismaService.student.findUnique({
            where: {
                id,
            },
            include: {
                absentees: {
                    include: {
                        absenteeismDetails: true,
                    },
                },
                parents: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        tc: true,
                        address: true,
                        phoneNumber1: true,
                    },
                },
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
                classrooms: {
                    include: {
                        classDetails: true,
                        teacher: true,
                        absenteeismDetails: {
                            include: {
                                absenteeism: true,
                            },
                        },
                    },
                },
            },
        });

        if (!student) {
            throw new BadRequestException("Student not found");
        }

        return {
            message: "Student retrieved successfully",
            student,
        };
    }

    async createAbsenteeism(student: Student) {
        const absenteeismRecords: Prisma.AbsenteeismCreateManyInput[] = [];

        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() + i);
            absenteeismRecords.push({
                date: new Date(date),
                joined: 0,
                absent: 0,
                scheduled: 0,
                totalCount: 8,
                studentId: student.id,
                institutionId: student.institutionId,
            });
        }

        await this.prismaService.absenteeism.createMany({
            data: absenteeismRecords,
        });

        return {
            message: "Absenteeism created successfully",
            absenteeismRecords,
        };
    }
}
