import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Request,
    UseGuards,
} from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { InstitutionGuard } from "src/common/guards/institution/institution.guard";
import { CustomRequest } from "src/common/type/common.type";
import { Teacher, TeacherUpdate } from "./types/teacher.type";

@Controller("api/teacher")
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Post("create-teacher")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async crateTeacher(@Body() body: Teacher, @Request() req: CustomRequest) {
        const institutionId = req.user.institutionId;
        return await this.teacherService.createTeacher(body, institutionId);
    }

    @Put("update-teacher")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async updateTeacher(@Body() body: TeacherUpdate) {
        return await this.teacherService.updateTeacher(body);
    }
}
