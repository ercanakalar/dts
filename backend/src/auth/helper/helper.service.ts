import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtPayload } from "../types/auth.types";
import type { AuthService } from "../auth.service";

@Injectable()
export class HelperService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        private prismaService: PrismaService,
    ) {}

    async givePermit(userId: number, contextId: number) {
        await this.prismaService.permit.create({
            data: {
                userId,
                contextId,
                roleId: 1,
            },
        });
    }

    async getTokens(
        theUser: Awaited<ReturnType<AuthService["findLoginUser"]>>,
    ) {
        const payload: JwtPayload = {
            id: theUser.id,
            email: theUser.email,
            username: theUser.username,
            permit: theUser.permit,
        };
        const [accessToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get<string>("SECRET_KEY"),
                expiresIn: "7d",
            }),
        ]);

        return { accessToken };
    }

    async hashData(data: string) {
        return await bcrypt.hash(data, 10);
    }

    async createTokenForEmail(email: string) {
        const payload = {
            email,
        };
        const [emailToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get<string>("SECRET_KEY"),
                expiresIn: "5m",
                algorithm: "HS256",
            }),
        ]);
        return emailToken;
    }

    async decodeToken(token: string) {
        return await this.jwtService.decode(token);
    }

    async verifyToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.config.get<string>("SECRET_KEY"),
                algorithms: ["HS256"],
            });
        } catch {
            throw new UnauthorizedException("Bu bağlantının süresi doldu");
        }
    }

    async comparePasswords(password: string, hashPassword: string) {
        return await bcrypt.compare(password, hashPassword);
    }

    async contextToken(contextId: string) {
        const payload = {
            context: contextId,
        };
        const [contextToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get<string>("SECRET_KEY"),
                expiresIn: "7d",
            }),
        ]);

        return { context_token: contextToken };
    }
}
