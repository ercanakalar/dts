import { BadRequestException } from "@nestjs/common";
import {
    FileFieldsInterceptor,
    FileInterceptor,
} from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";

export function UploadFileInterceptor(filename: string) {
    return FileInterceptor("file", {
        storage: diskStorage({
            destination: join("../uploads/", filename),
            filename: (req, file, callback) => {
                const id = req.params.flightId;
                const fileArr = file.originalname.split(".");
                const ext = fileArr[1];
                callback(null, id + "." + ext);
            },
        }),
        fileFilter: (req, file, callback) => {
            callback(
                new BadRequestException("Only PDF and PNG files are allowed!"),
                false,
            );
        },
    });
}
export function UploadMultiFileInterceptor(
    filename: { name: string; path: string }[],
) {
    return FileFieldsInterceptor(filename, {
        storage: diskStorage({
            destination: (req, file, callback) =>
                callback(
                    null,
                    join(
                        "../uploads/",
                        filename.find((f) => f.name === file.fieldname)!.path,
                    ),
                ),
            filename: (req, file, callback) => {
                const id = req.params.flightId;
                const fileArr = file.originalname.split(".");
                const ext = fileArr[1];
                callback(null, id + "." + ext);
            },
        }),
    });
}
