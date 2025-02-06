import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { PrismaModule } from "src/prisma/prisma.module";

import { ParentService } from "./parent.service";
import { ParentController } from "./parent.controller";

import { HelperService } from "src/auth/helper/helper.service";

@Module({
    imports: [PrismaModule, ConfigModule.forRoot(), JwtModule.register({})],
    providers: [ParentService, HelperService],
    controllers: [ParentController],
})
export class ParentModule {}
