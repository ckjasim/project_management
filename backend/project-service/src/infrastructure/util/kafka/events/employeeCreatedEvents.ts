
import { Topics } from "../topics/topics";

export interface EmployeeCreateEvent {
    topic: Topics.employeeCreated;
    data: {
        _id: string;
        name: string;
        email: string;
        organization:string;
        role:string
        password:string;
        mobile: number; 
        jobRole: string;
        profileImage?: {
            public_id: string; 
            url: string;  
          };

    };
}
