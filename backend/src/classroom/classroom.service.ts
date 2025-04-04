import { ConflictException, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";
import {
    ClassDetails,
    Classroom,
    UpdateClassDetails,
    UpdateClassroom,
} from "./types/classroom.type";
import { ClassroomStatus } from "@prisma/client";

@Injectable()
export class ClassroomService {
    constructor(private prismaService: PrismaService) {}

    async createClassroom(body: Classroom) {
        const existingClassDetail =
            await this.prismaService.classDetails.findFirst({
                where: {
                    classNo: body.classDetailsId,
                },
            });

        if (existingClassDetail) {
            throw new ConflictException(
                "Classroom with this class number already exists",
            );
        }

        const existingClassroom = await this.prismaService.classroom.findFirst({
            where: {
                AND: [
                    { classDate: body.classDate },
                    { startClass: body.startClass },
                    { endClass: body.endClass },
                ],
            },
        });

        if (existingClassroom) {
            throw new ConflictException(
                "Classroom with this date already exists",
            );
        }

        const newClassroom = await this.prismaService.classroom.create({
            data: {
                classDate: body.classDate,
                startClass: body.startClass,
                endClass: body.endClass,
                status: ClassroomStatus[
                    body.status as keyof typeof ClassroomStatus
                ],
                teacherId: body.teacherId,
                studentId: body.studentId,
                classDetailsId: body.classDetailsId,
                institutionId: body.institutionId,
            },
        });

        return {
            message: "Classroom created successfully",
            data: newClassroom,
        };
    }
    async updateClassroom(body: UpdateClassroom) {
        const existingClassroom = await this.prismaService.classroom.findFirst({
            where: {
                classDetailsId: body.classDetailsId,
            },
        });

        if (!existingClassroom) {
            throw new ConflictException(
                "Classroom with this class number does not exist",
            );
        }

        const updatedClassroom = await this.prismaService.classroom.update({
            where: {
                id: body.id,
            },
            data: {
                classDate: body.classDate,
                startClass: body.startClass,
                endClass: body.endClass,
                status: ClassroomStatus[
                    body.status as keyof typeof ClassroomStatus
                ],
                teacherId: body.teacherId,
                studentId: body.studentId,
                institutionId: body.institutionId,
                classDetailsId: body.classDetailsId,
                updatedAt: new Date(),
            },
        });

        return {
            message: "Classroom updated successfully",
            data: updatedClassroom,
        };
    }

    async deleteClassroom(id: string) {
        const existingClassroom = await this.prismaService.classroom.findFirst({
            where: {
                id,
            },
        });

        if (!existingClassroom) {
            throw new ConflictException(
                "Classroom with this ID does not exist",
            );
        }

        await this.prismaService.classroom
            .delete({
                where: {
                    id,
                },
            })
            .catch((error) => {
                throw new ConflictException(
                    "Error deleting classroom: " + error.message,
                );
            });

        return {
            message: "Classroom deleted successfully",
        };
    }

    async createClassDetail(body: ClassDetails) {
        const existingClassDetail =
            await this.prismaService.classDetails.findFirst({
                where: {
                    AND: [
                        { classNo: body.classNo },
                        { institutionId: body.institutionId },
                    ],
                },
            });

        if (existingClassDetail) {
            throw new ConflictException(
                "Classroom with this class number already exists",
            );
        }

        const newClassDetail = await this.prismaService.classDetails.create({
            data: {
                classNo: body.classNo,
                description: body.description,
                institutionId: body.institutionId,
            },
        });

        return {
            message: "Classroom created successfully",
            data: newClassDetail,
        };
    }

    async updateClassDetails(body: UpdateClassDetails) {
        const existingClassDetail =
            await this.prismaService.classDetails.findFirst({
                where: {
                    id: body.id,
                },
            });

        if (!existingClassDetail) {
            throw new ConflictException(
                "Classroom with this class number does not exist",
            );
        }

        const updatedClassDetail = await this.prismaService.classDetails.update(
            {
                where: {
                    id: body.id,
                },
                data: {
                    classNo: body.classNo,
                    description: body.description,
                    institutionId: body.institutionId,
                    updatedAt: new Date(),
                },
            },
        );

        return {
            message: "Classroom updated successfully",
            data: updatedClassDetail,
        };
    }

    async deleteClassDetail(id: string) {
        const existingClassDetail =
            await this.prismaService.classDetails.findFirst({
                where: {
                    id,
                },
            });

        if (!existingClassDetail) {
            throw new ConflictException(
                "Classroom with this ID does not exist",
            );
        }

        await this.prismaService.classDetails
            .delete({
                where: {
                    id,
                },
            })
            .catch((error) => {
                throw new ConflictException(
                    "Error deleting classroom: " + error.message,
                );
            });

        return {
            message: "Classroom deleted successfully",
        };
    }
}
