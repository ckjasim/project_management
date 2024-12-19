
import { Topics } from "../topics/topics";

export interface employeeUpdatedEvent {
    topic: Topics.employeeUpdated;
    data: {
        _id: string;
        isBlock:any;
       
    };
}