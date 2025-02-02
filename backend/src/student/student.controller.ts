import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";

import { StudentService } from "./student.service";
import { InstitutionGuard } from "src/common/guards/institution/institution.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("api/student")
export class StudentController {
    constructor(private readonly studentsService: StudentService) {}

    @Post("upload")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async uploadStudents(@Body() body: any, @Request() req: any) {
        const institutionId = req.user.institutionId;
        return await this.studentsService.uploadStudents(body, institutionId);
    }

    @Post("upload-file")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor("file"))
    async uploadStudentsWithFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        const institutionId = req.user.institutionId;
        return await this.studentsService.uploadStudentsWithFile(
            file,
            institutionId,
        );
    }
}
