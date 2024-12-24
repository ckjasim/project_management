
import { Topics } from "../topics/topics";

export interface UserUpdatedEvent {
    topic: Topics.userUpdated;
    data: {
        _id: string;
        isBlock:any;
       
    };
}