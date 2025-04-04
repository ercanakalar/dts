import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

import { DriverService } from "./driver.service";
import { HelperService } from "src/auth/helper/helper.service";

import { DriverController } from "./driver.controller";

import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule, ConfigModule.forRoot(), JwtModule.register({})],
    providers: [DriverService, HelperService],
    controllers: [DriverController],
})
export class DriverModule {}
