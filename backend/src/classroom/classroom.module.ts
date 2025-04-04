import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { ClassroomService } from "./classroom.service";
import { HelperService } from "src/auth/helper/helper.service";

import { ClassroomController } from "./classroom.controller";

import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule, ConfigModule.forRoot(), JwtModule.register({})],
    providers: [ClassroomService, HelperService],
    controllers: [ClassroomController],
})
export class ClassroomModule {}
