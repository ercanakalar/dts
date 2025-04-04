import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from "@nestjs/common";

import { ClassroomService } from "./classroom.service";
import { InstitutionGuard } from "src/common/guards/institution/institution.guard";
import { Classroom } from "./types/classroom.type";

@Controller("classroom")
export class ClassroomController {
    constructor(private readonly classroomService: ClassroomService) {}

    @Post("create")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async crateClassroom(@Body() body: Classroom) {
        return await this.classroomService.createClassroom(body);
    }
}
