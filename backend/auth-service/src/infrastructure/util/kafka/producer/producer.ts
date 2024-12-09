

import { Publisher } from "../basePublisher";
import { EmployeeCreateEvent } from "../events/employeeCreatedEvents";
import { UserCreateEvent } from "../events/userCreatedEvents";
import { Topics } from "../topics/topics";


export class UserCreatedPublisher extends Publisher<UserCreateEvent>{
    topic: Topics.userCreated = Topics.userCreated;
}
export class EmployeeCreatedPublisher extends Publisher<EmployeeCreateEvent>{
    topic: Topics.employeeCreated = Topics.employeeCreated;
}