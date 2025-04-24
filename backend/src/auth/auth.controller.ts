import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import { Public } from "src/common/decorators";
import { CreateUser, GiveRole, LoginUser } from "./types/auth.types";
import { AuthService } from "./auth.service";
import { UserExistsGuard } from "src/common/guards/user-exists/user-exists.guard";
import { AdminGuard } from "src/common/guards/admin/admin.guard";
import { HelperService } from "./helper/helper.service";

@Controller("api/user")
export class AuthController {
    constructor(
        private authService: AuthService,
        private helperService: HelperService,
    ) {}

    @Public()
    @Post("create-user")
    @UseGuards(UserExistsGuard)
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() user: CreateUser) {
        return await this.authService.createUser(user);
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() user: LoginUser) {
        return await this.authService.login(user);
    }

    @Get("")
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.OK)
    async getUserById(@Query() params: { id: string }, @Req() req: any) {
        const institutionId = req.user.institutionId;
        return await this.authService.getUserById(params.id, institutionId);
    }

    @Post("permit")
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.OK)
    async giveRole(@Body() body: GiveRole) {
        return await this.authService.giveRole(body);
    }

    @Post("refresh")
    @Public()
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() body: { refreshToken: string }) {
        const { refreshToken: inputRefreshToken } = body;

        const payload: any =
            await this.authService.verifyRefreshToken(inputRefreshToken);
        const { accessToken, refreshToken } =
            await this.helperService.generateTokens(payload);

        await this.authService.updateRefreshToken(payload.tc, refreshToken);

        return { accessToken, refreshToken };
    }
}
