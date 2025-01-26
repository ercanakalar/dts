import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth/auth.service";
import { HelperService } from "./auth/helper/helper.service";
import { JwtService } from "@nestjs/jwt";
import { NotificationModule } from "./notification/notification.module";
import { APP_GUARD } from "@nestjs/core";
import { AccessGuard } from "./common/guards/access-guard";
import { EmailService } from "./notification/email/email.service";
import { ContextGuard } from "./common/guards/context.guard";
import { FileManagementService } from "./common/services/file-management/file-management.service";

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        ConfigModule.forRoot(),
        NotificationModule,
    ],
    providers: [
        AuthService,
        HelperService,
        JwtService,
        { provide: APP_GUARD, useClass: AccessGuard },
        { provide: APP_GUARD, useClass: ContextGuard },

        EmailService,
        FileManagementService,
    ],
})
export class AppModule {}
