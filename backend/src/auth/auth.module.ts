import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { HelperService } from "./helper/helper.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "src/notification/email/email.service";
import { AccessStrategy } from "./strategy/access.strategy";
import { ContextStrategy } from "./strategy/context.strategy";

@Module({
    imports: [PrismaModule, ConfigModule.forRoot(), JwtModule.register({})],
    providers: [
        AuthService,
        HelperService,
        JwtService,
        EmailService,
        AccessStrategy,
        ContextStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
