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
import { FileManagementService } from "./common/services/file-management/file-management.service";
import { StudentModule } from "./student/student.module";
import { StudentService } from "./student/student.service";

@Module({
    imports: [
        AuthModule,
        StudentModule,
        PrismaModule,
        ConfigModule.forRoot(),
        NotificationModule,
    ],
    providers: [
        AuthService,
        StudentService,
        HelperService,
        JwtService,
        { provide: APP_GUARD, useClass: AccessGuard },
        EmailService,
        FileManagementService,
    ],
})
export class AppModule {}
