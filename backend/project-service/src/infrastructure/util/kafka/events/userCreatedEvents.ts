
import { Topics } from "../topics/topics";

export interface UserCreateEvent {
    topic: Topics.userCreated;
    data: {
        _id: string;
        name: string;
        email: string;
        organization:string;
        role:string
        password:string;
    };
}