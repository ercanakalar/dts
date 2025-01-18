export type CreateUser = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: string;
    permission: string;
};

export type LoginUser = {
    email: string;
    password: string;
};

export type ForgotPassword = {
    email: string;
};

export type ResetPassword = {
    password: string;
};

export type UpdateUser = {
    id: number;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: string;
    permission: string;
    context: string;
};

export type Tokens = {
    access_token: string;
    refresh_token: string;
};

export type Permit = {
    id: number;
    contextId: number;
};

export type JwtPayload = {
    id: number;
    email: string;
    username: string;
    permit: Permit[];
};

export type PermitType = {
    id: number;
    contextId: number;
};

export type UserType = {
    id: number;
    email: string;
    username: string;
    permit: PermitType[];
};

export type SelectContext = {
    context: string;
};

export type UserFilter = {
    page: string;
    query: string;
    disabled: string | undefined;
};

export type GiveRole = {
    user: number;
    context: number;
    role: number;
};

export type UpdatePermit = {
    context: number;
};
