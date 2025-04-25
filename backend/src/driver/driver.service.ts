import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { HelperService } from "src/auth/helper/helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Driver, DriverUpdate } from "./types/driver.type";

@Injectable()
export class DriverService {
    constructor(
        private prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async createDriver(body: Driver) {
        const institution = await this.prismaService.institution.findUnique({
            where: {
                id: body.institutionId,
            },
        });
        if (!institution) {
            throw new NotFoundException(
                `Institution with ID ${body.institutionId} not found`,
            );
        }

        const { accessToken, refreshToken } =
            await this.helperService.generateTokens({
                tc: body.tc,
                institutionId: institution.id,
            });

        const hashedPassword = await this.helperService.toHashPassword(body.tc);
        if (!hashedPassword) {
            throw new InternalServerErrorException("Password hashing failed");
        }
        const existingDriver = await this.prismaService.driver.findUnique({
            where: {
                tc: body.tc,
            },
        });
        if (existingDriver) {
            throw new InternalServerErrorException(
                `Driver with TC ${body.tc} already exists`,
            );
        }
        const teacherAuth = await this.prismaService.auth
            .create({
                data: {
                    tc: body.tc,
                    phoneNumber: body.phoneNumber1,
                    password: hashedPassword,
                    accessToken,
                    refreshToken,
                },
            })
            .catch(() => {
                throw new ConflictException("The driver already exists");
            });

        await this.prismaService.driver.create({
            data: {
                authId: teacherAuth.id,
                tc: body.tc,
                firstName: body.firstName,
                lastName: body.lastName,
                address: body.address,
                phoneNumber1: body.phoneNumber1,
                phoneNumber2: body.phoneNumber2,
                institutionId: institution.id,
                institutionKey: institution.name,
            },
        });

        await this.prismaService.permit.create({
            data: {
                institutionId: institution.id,
                authId: teacherAuth.id,
                roleId: body.roleId,
            },
        });

        return {
            message: "Driver created successfully",
        };
    }

    async updateDriver(body: DriverUpdate) {
        const institution = await this.prismaService.institution.findUnique({
            where: {
                id: body.institutionId,
            },
        });
        if (!institution) {
            throw new NotFoundException(
                `Institution with ID ${body.institutionId} not found`,
            );
        }

        const existingDriver = await this.prismaService.driver.findUnique({
            where: {
                id: body.id,
            },
        });
        if (!existingDriver) {
            throw new NotFoundException(`Driver with ID ${body.id} not found`);
        }

        await this.prismaService.driver.update({
            where: {
                id: body.id,
            },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                address: body.address,
                phoneNumber1: body.phoneNumber1,
                phoneNumber2: body.phoneNumber2,
                institutionId: institution.id,
                tc: body.tc,
            },
        });

        return {
            message: "Driver updated successfully",
        };
    }

    async deleteDriver(id: string) {
        const driver = await this.prismaService.driver.findUnique({
            where: {
                id,
            },
        });
        if (!driver) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }

        await this.prismaService.driver
            .delete({
                where: {
                    id,
                },
            })
            .catch(() => {
                throw new InternalServerErrorException(
                    `Failed to delete driver with ID ${id}`,
                );
            });

        await this.prismaService.auth.delete({
            where: {
                id: driver.authId!,
            },
        });

        return {
            message: "Driver deleted successfully",
        };
    }

    async getDriverById(id: string) {
        const driver = await this.prismaService.driver.findUnique({
            where: {
                id,
            },
            include: {
                institution: true,
                routes: true,
                waypoint: true,
            },
        });
        if (!driver) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }

        return driver;
    }
}
