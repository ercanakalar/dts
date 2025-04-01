import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { InstitutionGuard } from "src/common/guards/institution/institution.guard";

import { StudentService } from "./student.service";

import { CustomRequest } from "src/common/type/common.type";
import { UploadStudentType } from "./types/student.type";

@Controller("api/student")
export class StudentController {
    constructor(private readonly studentsService: StudentService) {}

    @Post("upload")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async uploadStudents(
        @Body() body: UploadStudentType[],
        @Request() req: CustomRequest,
    ) {
        const institutionId = req.user.institutionId;
        return await this.studentsService.uploadStudents(body, institutionId);
    }

    @Post("upload-file")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor("file"))
    async uploadStudentsWithFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: CustomRequest,
    ) {
        const institutionId = req.user.institutionId;
        return await this.studentsService.uploadStudentsWithFile(
            file,
            institutionId,
        );
    }

    @Post("create")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async crateStudent(
        @Body() body: UploadStudentType,
        @Request() req: CustomRequest,
    ) {
        const institutionId = req.user.institutionId;
        return await this.studentsService.uploadStudent(body, institutionId);
    }

    @Delete("delete/:id")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async deleteStudent(@Param("id") id: string) {
        return await this.studentsService.deleteStudent(id);
    }
}
