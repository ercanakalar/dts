export type CreateUser = {
    email: string;
    tc: string;
    phoneNumber: string;
    password: string;
    institutionKey: string;
    roleId: string;
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

export type GiveRole = {
    userId: string;
    roleId: string;
    institutionId: string;
};

export type DecodedToken = {
    tc: string;
    institutionId: string;
    permitId: string;
    iat: number;
    exp: number;
};
