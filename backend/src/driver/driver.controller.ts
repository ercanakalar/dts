import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { DriverService } from "./driver.service";
import { InstitutionGuard } from "src/common/guards/institution/institution.guard";
import { Driver, DriverUpdate } from "./types/driver.type";

@Controller("api/driver")
export class DriverController {
    constructor(private readonly driverService: DriverService) {}

    @Post("create")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async crateDriver(@Body() body: Driver) {
        return await this.driverService.createDriver(body);
    }

    @Put("update")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async updateDriver(@Body() body: DriverUpdate) {
        return await this.driverService.updateDriver(body);
    }

    @Delete("delete")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    async deleteDriver(@Query() params: { id: string }) {
        return await this.driverService.deleteDriver(params.id);
    }
}
