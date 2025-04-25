import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { scrypt, randomBytes, createHash } from "crypto";
import { promisify } from "util";

import { PrismaService } from "src/prisma/prisma.service";
import { DecodedToken } from "../types/auth.types";

const scryptAsync = promisify(scrypt);

@Injectable()
export class HelperService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prismaService: PrismaService,
    ) {}

    async toHashPassword(password: string) {
        if (!password || typeof password !== "string") {
            throw new Error(
                "Invalid password: Password must be a non-empty string.",
            );
        }

        const salt = randomBytes(8).toString("hex");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        const hashedPassword = buf.toString("hex");

        return `${hashedPassword}.${salt}`;
    }

    async comparePassword(
        storedPassword: string,
        suppliedPassword: string,
    ): Promise<boolean> {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buf.toString("hex") === hashedPassword;
    }

    async verifyAccessToken(token: string): Promise<DecodedToken> {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("ACCESS_KEY"),
        });
    }

    async verifyRefreshToken(token: string): Promise<DecodedToken> {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("REFRESH_KEY"),
        });
    }

    changedPasswordAfter(JWTTimestamp: number, passwordChangedAt: number) {
        if (passwordChangedAt > JWTTimestamp) {
            return true;
        }
        return false;
    }

    async createPasswordResetToken() {
        const randomBuffer = randomBytes(32);
        const passwordResetToken = randomBuffer.toString("hex");

        const hash = createHash("sha256");
        hash.update(passwordResetToken);
        const newResetToken = hash.digest("hex");

        return { newResetToken };
    }

    newDate(min: number): Date {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime());
        futureDate.setMinutes(futureDate.getMinutes() + min);
        return futureDate;
    }

    async createAccessToken(data: {
        tc: string;
        institutionId: string;
        permitId?: string;
    }) {
        return this.jwtService.signAsync(
            {
                userTc: data.tc,
                institutionId: data.institutionId,
                permitId: data.permitId,
            },
            {
                secret: this.configService.get("ACCESS_KEY"),
                expiresIn: this.configService.get("ACCESS_EXPIRES_IN"),
            },
        );
    }

    async createRefreshToken(data: {
        tc: string;
        institutionId: string;
        permitId?: string;
    }) {
        return this.jwtService.signAsync(
            {
                userTc: data.tc,
                institutionId: data.institutionId,
                permitId: data.permitId,
            },
            {
                secret: this.configService.get("REFRESH_KEY"),
                expiresIn: this.configService.get("REFRESH_EXPIRES_IN"),
            },
        );
    }

    public async generateTokens(payload: any) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    ...payload,
                },
                {
                    secret: this.configService.get("ACCESS_KEY"),
                    expiresIn: this.configService.get("ACCESS_EXPIRES_IN"),
                },
            ),
            this.jwtService.signAsync(
                {
                    ...payload,
                },
                {
                    secret: this.configService.get("REFRESH_KEY"),
                    expiresIn: this.configService.get("REFRESH_EXPIRES_IN"),
                },
            ),
        ]);
        return { accessToken, refreshToken };
    }

    async getRoleId(role: string) {
        const roleId = await this.prismaService.role.findFirst({
            where: {
                roleType: role,
            },
            select: {
                id: true,
                roleType: true,
            },
        });

        if (!roleId) {
            throw new Error("Role not found");
        }

        return roleId;
    }
}
