import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "./prisma/prisma.module";

import { AuthModule } from "./auth/auth.module";

import { NotificationModule } from "./notification/notification.module";

import { AccessGuard } from "./common/guards/access.guard";

import { StudentModule } from "./student/student.module";
import { TeacherModule } from "./teacher/teacher.module";
import { DriverModule } from "./driver/driver.module";
import { ClassroomModule } from "./classroom/classroom.module";

@Module({
    imports: [
        PrismaModule,
        NotificationModule,
        AuthModule,
        StudentModule,
        TeacherModule,
        DriverModule,
        ClassroomModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: AccessGuard }],
})
export class AppModule {}
