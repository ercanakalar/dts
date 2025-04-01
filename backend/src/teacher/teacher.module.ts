import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { TeacherService } from "./teacher.service";
import { TeacherController } from "./teacher.controller";

import { PrismaModule } from "src/prisma/prisma.module";
import { HelperService } from "src/auth/helper/helper.service";

@Module({
    imports: [PrismaModule, ConfigModule.forRoot(), JwtModule.register({})],
    providers: [TeacherService, HelperService],
    controllers: [TeacherController],
})
export class TeacherModule {}
