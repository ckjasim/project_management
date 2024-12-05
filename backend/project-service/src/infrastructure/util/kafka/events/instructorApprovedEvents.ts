import { Topics } from "../topics/topics";

export interface InstructorAprovedEvent {
    topic: Topics.instructorAproval;
    data: {
        _id: string;
        name: string;
        email: string;
        status:string;
        isInstructor:boolean
    };
}