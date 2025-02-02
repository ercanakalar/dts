import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { Public } from "src/common/decorators";
import { CreateUser, GiveRole, LoginUser } from "./types/auth.types";
import { AuthService } from "./auth.service";
import { HelperService } from "./helper/helper.service";
import { EmailService } from "src/notification/email/email.service";
import { UserExistsGuard } from "src/common/guards/user-exists/user-exists.guard";
import { AdminGuard } from "src/common/guards/admin/admin.guard";

@Controller("api/user")
export class AuthController {
    constructor(
        private authService: AuthService,
        private helperService: HelperService,
        private emailService: EmailService,
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

    // @Public()
    // @Post("forgot-password")
    // @HttpCode(HttpStatus.OK)
    // async forgotPassword(@Body() user: ForgotPassword) {
    //     try {
    //         await this.authService.validateUserWithEmail(user.email);
    //     } catch (err) {
    //         throw err;
    //     }

    //     const emailToken = await this.helperService.createTokenForEmail(
    //         user.email,
    //     );
    //     const title = "UMS Parola Yenileme";

    //     const body =
    //         "Aşağıdaki linke tıklayarak parolanızı yenileyebilirsiniz..<br><br>";
    //     const link = `<table role='presentation' cellspacing='0' cellpadding='0' border='0'>
    //                 <tbody>
    //                     <tr>
    //                         <td class="x_button-td x_button-td-primary" style="border-radius:4px; background:#1976d2">
    //                             <a href=http://ums.titra.local/forgot-password/${emailToken} target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" class="x_button-a x_button-a-primary" style="background:#1976d2; border:1px solid #1976d2; font-family:sans-serif; font-size:15px; line-height:15px; text-decoration:none; padding:13px 17px; color:#ffffff; display:block; border-radius:4px" data-linkindex="0">Parolamı Sıfırla</a>
    //                         </td>
    //                     </tr>
    //                 </tbody>
    //             </table>`;

    //     const footer = `<small>Not: Parola sıfırlama linki 5 dakika süreyle geçerli olmaktadır!</small>`;
    //     await this.emailService.sendEmail(
    //         title,
    //         body + link + footer,
    //         user.email,
    //     );
    // }

    // @Public()
    // @Post("forgot-password/:token")
    // @HttpCode(HttpStatus.OK)
    // async changePassword(
    //     @Param("token") token: string,
    //     @Body() user: ResetPassword,
    // ) {
    //     const payload = await this.helperService.decodeToken(token);

    //     try {
    //         await this.authService.validateUserWithEmail(payload.email);
    //         await this.authService.forgotPassword(payload.email, user.password);
    //     } catch (err) {
    //         throw err;
    //     }

    //     return true;
    // }

    // @Public()
    // @Get("reset-password/:token")
    // @HttpCode(HttpStatus.ACCEPTED)
    // async resetPassword(@Param("token") token: string) {
    //     try {
    //         const payload = await this.helperService.verifyToken(token);
    //         await this.authService.validateUserWithEmail(payload.email);
    //     } catch (err) {
    //         throw err;
    //     }

    //     return true;
    // }

    // @Get("")
    // @HttpCode(HttpStatus.OK)
    // async getAllUsersByQuery(@Query() params: UserFilter) {
    //     return await this.authService.getAllUsersByFilter(params);
    // }

    @Get("")
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.OK)
    async getUserById(@Query() params: { id: string }) {
        return await this.authService.getUserById(params.id);
    }

    // @Get("attendant")
    // @HttpCode(HttpStatus.OK)
    // async getAllUsers() {
    //     return await this.authService.getAllUsers();
    // }

    // @Public()
    // @Get("contexts")
    // @HttpCode(HttpStatus.OK)
    // async getContexts() {
    //     const allContexts = await this.authService.getContexts();
    //     return allContexts;
    // }

    // @ContextPublic()
    // @Post("context")
    // @HttpCode(HttpStatus.ACCEPTED)
    // async context(
    //     @Body() selectContext: SelectContext,
    //     @GetUser("id") id: number,
    // ) {
    //     await this.authService.permissions(id, parseInt(selectContext.context));
    //     const contextToken = await this.helperService.contextToken(
    //         selectContext.context,
    //     );
    //     return contextToken;
    // }

    // @Get("/roles")
    // @HttpCode(HttpStatus.OK)
    // async getAllRoles() {
    //     return await this.authService.getAllRoles();
    // }

    // @Get("/permits")
    // @HttpCode(HttpStatus.OK)
    // async getAllPermits() {
    //     return await this.authService.getAllPermits();
    // }

    // @Patch("/")
    // @HttpCode(HttpStatus.OK)
    // async updateUser(@Body() user: UpdateUser) {
    //     return await this.authService.updateUser(user);
    // }

    @Post("permit")
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.OK)
    async giveRole(@Body() body: GiveRole) {
        return await this.authService.giveRole(body);
    }

    // @Delete("permit/:permitId")
    // @HttpCode(HttpStatus.OK)
    // async deletePermit(@Param("permitId") permitId: string) {
    //     return await this.authService.deletePermit(parseInt(permitId));
    // }

    // @Put("permit/:permitId")
    // @HttpCode(HttpStatus.OK)
    // async updatePermit(
    //     @Param("permitId") permitId: string,
    //     @Body() body: UpdatePermit,
    // ) {
    //     return await this.authService.updatePermit(parseInt(permitId), body);
    // }

    // @Get("current-user")
    // @HttpCode(HttpStatus.OK)
    // async currentUser(
    //     @GetUser("id") id: number,
    //     @GetContext() contextId: number,
    // ) {
    //     return await this.authService.currentUser(id, contextId);
    // }
}
