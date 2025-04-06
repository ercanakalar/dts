import { ConflictException, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";
import {
    ClassDetails,
    Classroom,
    UpdateClassDetails,
    UpdateClassroom,
} from "./types/classroom.type";
import { AbsenteeismStatus, ClassroomStatus } from "@prisma/client";

@Injectable()
export class ClassroomService {
    constructor(private prismaService: PrismaService) {}

    async createClassroom(body: Classroom) {
        const existingClassDetail =
            await this.prismaService.classDetails.findUnique({
                where: {
                    id: body.classDetailsId,
                },
            });

        if (!existingClassDetail) {
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

        const absenteeism = await this.prismaService.absenteeism.findFirst({
            where: {
                AND: [
                    {
                        date: {
                            gte: new Date(
                                new Date(body.classDate).getFullYear(),
                                new Date(body.classDate).getMonth(),
                                1,
                            ),
                            lte: new Date(
                                new Date(body.classDate).getFullYear(),
                                new Date(body.classDate).getMonth() + 1,
                                0,
                            ),
                        },
                    },
                    { studentId: body.studentId },
                    { institutionId: body.institutionId },
                ],
            },
        });

        if (!absenteeism || absenteeism.scheduled === 8) {
            throw new ConflictException(
                "Absenteeism with this date does not exist",
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

        if (!newClassroom) {
            throw new ConflictException(
                "Error creating classroom: " + newClassroom,
            );
        }

        await this.prismaService.absenteeism.update({
            where: {
                id: absenteeism.id,
            },
            data: {
                scheduled: absenteeism.scheduled + 1,
                updatedAt: new Date(),
            },
        });

        await this.prismaService.absenteeismDetails.create({
            data: {
                date: body.classDate,
                status: AbsenteeismStatus[
                    body.status as keyof typeof AbsenteeismStatus
                ],
                absenteeismId: absenteeism.id,
                studentId: body.studentId,
                classroomId: newClassroom.id,
                institutionId: body.institutionId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return {
            message: "Classroom created successfully",
            data: newClassroom,
        };
    }
    async updateClassroom(body: UpdateClassroom) {
        const existingClassroom = await this.prismaService.classroom.findUnique(
            {
                where: {
                    id: body.id,
                },
                include: {
                    absenteeismDetails: true,
                },
            },
        );

        if (!existingClassroom) {
            throw new ConflictException(
                "Classroom with this class number does not exist",
            );
        }

        const existingClassDetail =
            await this.prismaService.absenteeismDetails.findUnique({
                where: {
                    classroomId: existingClassroom.id,
                },
                include: {
                    absenteeism: true,
                },
            });

        if (!existingClassDetail) {
            throw new ConflictException(
                "Absenteeism with this date does not exist",
            );
        }

        const newStatus =
            body.status === "COMPLETED"
                ? AbsenteeismStatus.JOINED
                : body.status === "CANCELED"
                  ? AbsenteeismStatus.NOT_JOINED
                  : body.status === "SCHEDULED"
                    ? AbsenteeismStatus.SCHEDULED
                    : existingClassDetail.status;

        if (
            existingClassDetail.absenteeism &&
            newStatus !== existingClassDetail.status
        ) {
            await this.prismaService.absenteeismDetails.update({
                where: {
                    id: existingClassDetail.id,
                },
                data: {
                    status: newStatus,
                    updatedAt: new Date(),
                },
            });
            await this.prismaService.absenteeism.update({
                where: {
                    id: existingClassDetail.absenteeismId!,
                },

                data: {
                    scheduled:
                        newStatus === AbsenteeismStatus.SCHEDULED
                            ? existingClassDetail.absenteeism.scheduled + 1
                            : existingClassDetail.absenteeism.scheduled > 0
                              ? existingClassDetail.absenteeism.scheduled - 1
                              : 0,
                    joined:
                        newStatus === AbsenteeismStatus.JOINED
                            ? existingClassDetail.absenteeism.joined + 1
                            : existingClassDetail.absenteeism.joined > 0
                              ? existingClassDetail.absenteeism.joined - 1
                              : 0,
                    absent:
                        newStatus === AbsenteeismStatus.NOT_JOINED
                            ? existingClassDetail.absenteeism.absent + 1
                            : existingClassDetail.absenteeism.absent > 0
                              ? existingClassDetail.absenteeism.absent - 1
                              : 0,
                    updatedAt: new Date(),
                },
            });
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
            include: {
                absenteeismDetails: {
                    where: {
                        id: existingClassDetail.id,
                    },
                },
            },
        });
        return {
            message: "Classroom updated successfully",
            data: updatedClassroom,
        };
    }

    async deleteClassroom(id: string) {
        const existingClassroom = await this.prismaService.classroom.findUnique(
            {
                where: {
                    id,
                },
                include: {
                    absenteeismDetails: {
                        include: {
                            absenteeism: true,
                        },
                    },
                },
            },
        );

        if (!existingClassroom) {
            throw new ConflictException(
                "Classroom with this ID does not exist",
            );
        }

        if (
            existingClassroom.absenteeismDetails &&
            existingClassroom.absenteeismDetails.absenteeism &&
            existingClassroom.absenteeismDetails.absenteeismId
        ) {
            await this.prismaService.absenteeismDetails
                .delete({
                    where: {
                        id: existingClassroom.absenteeismDetails.id,
                    },
                })
                .catch((error) => {
                    throw new ConflictException(
                        "Error deleting absenteeism details: " + error.message,
                    );
                });
            await this.prismaService.absenteeism
                .update({
                    where: {
                        id: existingClassroom.absenteeismDetails.absenteeismId,
                    },
                    data: {
                        scheduled:
                            existingClassroom.absenteeismDetails.absenteeism
                                .scheduled > 0
                                ? existingClassroom.absenteeismDetails
                                      .absenteeism.scheduled - 1
                                : 0,
                        joined:
                            existingClassroom.absenteeismDetails.absenteeism
                                .joined > 0
                                ? existingClassroom.absenteeismDetails
                                      .absenteeism.joined - 1
                                : 0,
                        absent:
                            existingClassroom.absenteeismDetails.absenteeism
                                .absent > 0
                                ? existingClassroom.absenteeismDetails
                                      .absenteeism.absent - 1
                                : 0,
                        updatedAt: new Date(),
                    },
                })
                .catch((error) => {
                    throw new ConflictException(
                        "Error updating absenteeism: " + error.message,
                    );
                });
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
