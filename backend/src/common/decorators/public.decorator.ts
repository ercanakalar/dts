import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata("isPublic", true);

export const ContextPublic = () => SetMetadata("isContextPublic", true);
