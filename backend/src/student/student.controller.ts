import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
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
import {
    Parent,
    UpdateParent,
    UpdateStudent,
    UploadStudentType,
} from "./types/student.type";

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
    @Post("create-parent")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async crateParent(@Body() body: Parent) {
        return await this.studentsService.crateParent(body);
    }

    @Delete("delete")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async deleteStudent(@Query() params: { id: string }) {
        return await this.studentsService.deleteStudent(params.id);
    }

    @Patch("update")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async updateStudent(@Body() body: UpdateStudent) {
        return await this.studentsService.updateStudent(body);
    }
    @Patch("update-parent")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async updateParent(@Body() body: UpdateParent) {
        return await this.studentsService.updateParent(body);
    }

    @Get("/:id")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async getStudentById(@Param() params: { id: string }) {
        return await this.studentsService.getStudentById(params.id);
    }
}
