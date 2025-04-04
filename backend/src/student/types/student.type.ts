export type StudentFile = {
    firstName: string;
    lastName: string;
    tc: string;
    address: string;
    phoneNumber1: string;
    phoneNumber2: string;
    parentName: string;
    parentLastName: string;
    parentAddress: string;
    parentNumber1: string;
    parentTc: string;
    institutionId: string;
};

export type UploadStudentType = {
    firstName: string;
    lastName: string;
    tc: string;
    address: string;
    phoneNumber1: string;
    phoneNumber2: string;
    parentName: string;
    parentLastName: string;
    parentAddress: string;
    parentNumber1: string;
    parentTc: string;
    institutionId: string;
};

export type UpdateStudent = {
    id: string;
    authId: string;
    firstName: string;
    lastName: string;
    tc: string;
    address: string;
    phoneNumber1: string;
    phoneNumber2?: string;
    institutionId: string;
};

export type UpdateParent = {
    id: string;
    authId: string;
    parentName?: string;
    parentLastName?: string;
    parentAddress?: string;
    parentNumber1?: string;
    parentTc?: string;
};

export type Parent = {
    studentId: string;
    firstName: string;
    lastName: string;
    tc: string;
    address: string;
    phoneNumber1: string;
    roleId: string;
};
