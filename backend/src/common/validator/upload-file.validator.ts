import { FileValidator } from "@nestjs/common";
import { VALID_UPLOADS_MIME_TYPES } from "src/flight-plan/types/flight-plan.types";

export interface CustomUploadTypeValidatorOptions {
    fileType: string[];
}

export class CustomUploadFileTypeValidator extends FileValidator {
    private _allowedMimeTypes: string[];

    constructor(
        protected readonly validationOptions: CustomUploadTypeValidatorOptions,
    ) {
        super(validationOptions);
        this._allowedMimeTypes = this.validationOptions.fileType;
    }

    public isValid(file: any) {
        const isThere = VALID_UPLOADS_MIME_TYPES.find(
            (type) => type === file.mimetype,
        );
        if (isThere) return true;
        return false;
    }

    public buildErrorMessage() {
        return `Upload not allowed. Upload only files of type: ${this._allowedMimeTypes.join(
            ", ",
        )}`;
    }
}
