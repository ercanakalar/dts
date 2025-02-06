import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { ParentService } from "./parent.service";

import { InstitutionGuard } from "src/common/guards/institution/institution.guard";

@Controller("api/parent")
export class ParentController {
    constructor(private readonly parentService: ParentService) {}

    @Post("upload-file")
    @UseGuards(InstitutionGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor("file"))
    async uploadStudentsWithFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        const institutionId = req.user.institutionId;
        return await this.parentService.uploadParentWithFile(
            file,
            institutionId,
        );
    }
}
