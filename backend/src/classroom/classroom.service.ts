import { Injectable } from "@nestjs/common";

import { HelperService } from "src/auth/helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Classroom } from "./types/classroom.type";

@Injectable()
export class ClassroomService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async createClassroom(body: Classroom) {
        console.log(body);
    }
}
