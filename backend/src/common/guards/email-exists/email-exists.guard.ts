import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ConflictException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EmailExistsGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { username } = request.body;

        if (!username) {
            throw new ConflictException("Kullanıcı adı boş olamaz.");
        }

        const userWhere: Prisma.AuthWhereInput = {
            OR: [{ username: username }],
        };

        const userExists = await this.prismaService.auth.findFirst({
            where: userWhere,
        });

        if (userExists) {
            throw new ConflictException("Kullanıcı adı zaten mevcut.");
        }

        return true;
    }
}
