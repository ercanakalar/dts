import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
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
    async uploadStudents(@Body() body: UploadStudentType[]) {
        return await this.studentsService.uploadStudents(body);
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
    async crateStudent(@Body() body: UploadStudentType) {
        return await this.studentsService.uploadStudent(body);
    }

    @Delete("delete/:id")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async deleteStudent(@Query() params: { id: string }) {
        console.log(params);

        return await this.studentsService.deleteStudent(params.id);
    }
}
