import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/auth.types";

@Injectable()
export class ResetStrategy extends PassportStrategy(Strategy, "jwt-reset") {
    constructor(config: ConfigService) {
        const secretKey = config.get<string>("SECRET_KEY");
        if (!secretKey) {
            throw new Error("SECRET_KEY is not defined in the configuration");
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secretKey,
            passReqToCallback: true,
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }

    // validate(req: Request, payload: JwtPayload) {
    //     const resetToken = req
    //         .get("authorization")
    //         .replace("Bearer", "")
    //         .trim();
    //     return {
    //         ...payload,
    //         resetToken,
    //     };
    // }
}
