import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/auth.types";
import { Request } from "express";

@Injectable()
export class ContextStrategy extends PassportStrategy(
    Strategy,
    "context-access",
) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: extractJwtFromContextHeader,
            secretOrKey: configService.get<string>("SECRET_KEY"),
            algorithms: ["HS256"],
            passReqToCallback: true,
        });
    }

    async validate(
        req: Request & { user: JwtPayload },
        payload: { context: number },
    ) {
        return { ...req.user, ...payload };
    }
}

export function extractJwtFromContextHeader(req: Request) {
    if (req && req.headers) {
        const context = req.headers["x-context"] as string;
        if (!context) return false;
        const tokenArr = context.split(" ");
        return tokenArr[0] === "Bearer" ? tokenArr[1] : null;
    }
    return null;
}
