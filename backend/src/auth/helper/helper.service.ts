import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { scrypt, randomBytes, createHash } from "crypto";
import { promisify } from "util";

import { PrismaService } from "src/prisma/prisma.service";

const scryptAsync = promisify(scrypt);

@Injectable()
export class HelperService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prismaService: PrismaService,
    ) {}

    async toHashPassword(password: string) {
        const salt = randomBytes(8).toString("hex");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buf.toString("hex")}.${salt}`;
    }

    async comparePassword(
        storedPassword: string,
        suppliedPassword: string,
    ): Promise<boolean> {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buf.toString("hex") === hashedPassword;
    }

    async verifyToken(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get("SECRET_KEY"),
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

    async createToken(data: {
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
                secret: this.configService.get("SECRET_KEY"),
                expiresIn: this.configService.get("JWT_EXPIRES_IN"),
            },
        );
    }

    async checkExpiredToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get("SECRET_KEY"),
            });

            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                return true;
            }

            return false;
        } catch {
            return true;
        }
    }
}
