export type Teacher = {
    firstName: string;
    lastName: string;
    tc: string;
    address: string;
    phoneNumber1: string;
    phoneNumber2: string;
    experienceYear: number;
    institutionId: string;
    subjectId: string;
    roleId: string;
};

export interface TeacherUpdate extends Teacher {
    id: string;
}
