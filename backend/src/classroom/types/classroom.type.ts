export type Classroom = {
    startClass: Date;
    endClass: Date;
    classDate: Date;
    status: string;
    teacherId: string;
    studentId: string;
    classDetailsId: string;
    institutionId: string;
};

export interface UpdateClassroom extends Classroom {
    id: string;
}

export type ClassDetails = {
    classNo: string;
    description: string;
    institutionId: string;
};

export interface UpdateClassDetails extends ClassDetails {
    id: string;
}
