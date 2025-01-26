export type CreateUser = {
    username: string;
    password: string;
};

export type LoginUser = {
    username?: string;
    password: string;
};

export type JwtPayload = {
    id: string;
    username: string;
    role: string;
    institutionId: number;
};
