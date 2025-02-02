import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";
import { HelperService } from "src/auth/helper/helper.service";

@Module({
    imports: [PrismaModule, ConfigModule.forRoot(), JwtModule.register({})],
    providers: [StudentService, HelperService],
    controllers: [StudentController],
})
export class StudentModule {}
