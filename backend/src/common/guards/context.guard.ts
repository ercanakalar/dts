import { Injectable, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class ContextGuard extends AuthGuard("context-access") {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride("isPublic", [
            context.getHandler(),
            context.getClass(),
        ]);
        const isContextPublic = this.reflector.getAllAndOverride(
            "isContextPublic",
            [context.getHandler(), context.getClass()],
        );
        if (isContextPublic) return true;
        if (isPublic) return true;

        return super.canActivate(context);
    }
}
