export class RegisterUserDto {
    username: string;
    password: string;
    institutionKey: string;
}

export class LoginUserDto {
    username: string;
    password: string;
    institutionKey: string;
}

export class UpdatePasswordDto {
    id: string;
    oldPassword?: string;
    newPassword: string;
}
