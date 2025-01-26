import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { HelperService } from "./helper/helper.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "src/notification/email/email.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/common/guards/auth-guard/auth-guard.guard";

@Module({
    imports: [PrismaModule, ConfigModule.forRoot(), JwtModule.register({})],
    providers: [
        AuthService,
        HelperService,
        JwtService,
        EmailService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    controllers: [AuthController],
})
export class AuthModule {}
