import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

import { JwtPayload } from "../types/auth.types";

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
    constructor(config: ConfigService) {
        const secretKey = config.get<string>("SECRET_KEY");
        if (!secretKey) {
            throw new Error("SECRET_KEY is not defined in the configuration");
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secretKey,
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}
