import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";
import { AuthService } from "src/auth/auth.service";
import { ContextStrategy } from "src/auth/strategy/context.strategy";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user as Awaited<
            ReturnType<ContextStrategy["validate"]>
        >;
        const permit = user.permit.find(
            (permit) => permit.contextId === user.context,
        );

        if (!permit) return false;
        const permissions = (
            await this.authService.getPermissionsOfRole(permit.roleId)
        ).map((per) => per.permission.name);

        return this.matchRoles(roles, permissions);
    }

    matchRoles(roles: string[], permissions: string[]) {
        const result = roles.reduce(
            (state, role) =>
                permissions.reduce(
                    (st, permission) => permission === role || st,
                    false,
                ) || state,
            false,
        );
        if (!result) throw new ForbiddenException("Yetkisiz erişim!");
        return result;
    }
}
