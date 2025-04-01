import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { InstitutionGuard } from "src/common/guards/institution/institution.guard";
import { CustomRequest } from "src/common/type/common.type";
import { Teacher } from "./types/teacher.type";

@Controller("api/teacher")
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Post("create-teacher")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async crateStudent(@Body() body: Teacher, @Request() req: CustomRequest) {
        const institutionId = req.user.institutionId;
        console.log(body, institutionId);

        return await this.teacherService.createTeacher(body, institutionId);
    }
}
