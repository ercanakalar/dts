import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";

import { ClassroomService } from "./classroom.service";
import { InstitutionGuard } from "src/common/guards/institution/institution.guard";
import {
    ClassDetails,
    Classroom,
    UpdateClassDetails,
    UpdateClassroom,
} from "./types/classroom.type";

@Controller("api/classroom")
export class ClassroomController {
    constructor(private readonly classroomService: ClassroomService) {}

    @Post("create")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async createClassroom(@Body() body: Classroom) {
        return await this.classroomService.createClassroom(body);
    }

    @Put("update")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async updateClassroom(@Body() body: UpdateClassroom) {
        return await this.classroomService.updateClassroom(body);
    }

    @Delete("delete")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async deleteClassroom(@Query() params: { id: string }) {
        return await this.classroomService.deleteClassroom(params.id);
    }

    @Post("create-detail")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async createClassDetail(@Body() body: ClassDetails) {
        return await this.classroomService.createClassDetail(body);
    }

    @Put("update-detail")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async updateClassDetails(@Body() body: UpdateClassDetails) {
        return await this.classroomService.updateClassDetails(body);
    }

    @Delete("delete-detail")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async deleteClassDetail(@Query() params: { id: string }) {
        return await this.classroomService.deleteClassDetail(params.id);
    }
}
