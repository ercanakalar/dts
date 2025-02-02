import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { HelperService } from "src/auth/helper/helper.service";
import { DecodedToken } from "src/auth/types/auth.types";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly prismaService: PrismaService,
        private helperService: HelperService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.split(" ")[1];

        if (!token) {
            throw new ForbiddenException("Token not found");
        }

        const decoded: DecodedToken =
            await this.helperService.verifyToken(token);

        const permitWhere: Prisma.PermitWhereInput = {
            id: decoded.permitId,
        };

        const permit = await this.prismaService.permit.findFirst({
            where: permitWhere,
            include: {
                role: true,
            },
        });

        if (!permit?.roleId || permit?.role?.roleType !== "admin") {
            throw new ForbiddenException("Role is not admin");
        }

        return true;
    }
}
