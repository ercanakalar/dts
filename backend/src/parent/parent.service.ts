import { BadRequestException, Injectable } from "@nestjs/common";
import * as xlsx from "xlsx";

import { HelperService } from "src/auth/helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ParentFile } from "./types/parent.type";

@Injectable()
export class ParentService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async uploadParentWithFile(
        file: Express.Multer.File,
        institutionId: string,
    ) {
        if (!file) {
            throw new BadRequestException("No file provided");
        }
        const workbook = xlsx.read(file.buffer, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows: ParentFile[] = xlsx.utils.sheet_to_json(worksheet);

        const role = await this.helperService.getRoleId("parent");
        console.log(rows);

        let insertedParentCount = 0;
        let alreadyInsertedParentCount = 0;

        for (const parent of rows) {
            const token = await this.helperService.createToken({
                tc: parent.tc,
                institutionId,
            });

            const hashedPassword = await this.helperService.toHashPassword(
                parent.phoneNumber1,
            );

            const auth = await this.prismaService.auth.findUnique({
                where: {
                    tc: parent.tc,
                },
            });

            if (auth) {
                alreadyInsertedParentCount += 1;
                continue;
            }

            const newAuth = await this.prismaService.auth.create({
                data: {
                    tc: parent.tc,
                    phoneNumber: parent.phoneNumber1,
                    password: hashedPassword,
                    accessToken: token,
                },
            });

            if (!newAuth) {
                continue;
            }

            await this.prismaService.permit.create({
                data: {
                    institutionId,
                    authId: newAuth.id,
                    roleId: role.id,
                },
            });

            await this.prismaService.parent.create({
                data: {
                    authId: newAuth.id,
                    firstName: parent.firstName,
                    lastName: parent.lastName,
                    tc: parent.tc,
                    address: parent.address,
                    phoneNumber1: parent.phoneNumber1,
                    phoneNumber2: parent.phoneNumber2,
                    institutionKey: parent.institutionKey,
                    studentTc: JSON.parse(parent.studentTc),
                    institutionId,
                },
            });
            insertedParentCount += 1;
        }
        return {
            total: rows.length,
            insertedParentCount,
            alreadyInsertedParentCount,
            message: "Parents uploaded successfully",
        };
    }
}
