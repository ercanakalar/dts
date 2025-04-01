import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { PrismaModule } from "./prisma/prisma.module";

import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { HelperService } from "./auth/helper/helper.service";

import { NotificationModule } from "./notification/notification.module";
import { EmailService } from "./notification/email/email.service";

import { AccessGuard } from "./common/guards/access-guard";
import { FileManagementService } from "./common/services/file-management/file-management.service";

import { StudentModule } from "./student/student.module";
import { StudentService } from "./student/student.service";
import { TeacherModule } from './teacher/teacher.module';

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot(),
        NotificationModule,
        AuthModule,
        StudentModule,
        TeacherModule,
    ],
    providers: [
        JwtService,
        AuthService,
        StudentService,
        HelperService,
        { provide: APP_GUARD, useClass: AccessGuard },
        EmailService,
        FileManagementService,
    ],
})
export class AppModule {}
