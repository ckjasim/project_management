
import { Topics } from "../topics/topics";

export interface EmployeeUpdatedEvent {
    topic: Topics.employeeUpdated;
    data: {
        _id: string;
        isBlock:any

    };
}
