import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { InstitutionGuard } from "src/common/guards/institution/institution.guard";
import { Teacher, TeacherUpdate } from "./types/teacher.type";

@Controller("api/teacher")
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Post("create")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async crateTeacher(@Body() body: Teacher) {
        return await this.teacherService.createTeacher(body);
    }

    @Put("update")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async updateTeacher(@Body() body: TeacherUpdate) {
        return await this.teacherService.updateTeacher(body);
    }

    @Delete("delete")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async deleteTeacher(@Query() params: { id: string }) {
        return await this.teacherService.deleteTeacher(params.id);
    }

    @Get("/:id")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async getTeacherById(@Param() params: { id: string }) {
        return await this.teacherService.getTeacherById(params.id);
    }
}
