import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ConflictException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserExistsGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { email, tc, phoneNumber } = request.body;

        if (!tc || !phoneNumber) {
            throw new ConflictException("TC ve telefon numarası zorunludur.");
        }

        const userWhere: Prisma.AuthWhereInput = {
            OR: [{ email, tc, phoneNumber }],
        };

        const userExists = await this.prismaService.auth.findFirst({
            where: userWhere,
        });

        if (userExists) {
            throw new ConflictException("Bu kullanıcı zaten kayıtlı.");
        }

        return true;
    }
}
