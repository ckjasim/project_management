
import { Topics } from "../topics/topics";

export interface UserCreateEvent {
    topic: Topics.employeeCreated;
    data: {
        _id: string;
        name: string;
        email: string;
        isInstructor:boolean;
        password:string;
    };
}