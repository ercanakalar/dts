export type Driver = {
    firstName: string;
    lastName: string;
    tc: string;
    address: string;
    phoneNumber1: string;
    phoneNumber2: string;
    roleId: string;
    institutionId: string;
};
export interface DriverUpdate extends Driver {
    id: string;
}
