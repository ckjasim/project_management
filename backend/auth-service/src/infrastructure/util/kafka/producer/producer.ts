

import { Publisher } from "../basePublisher";
import { EmployeeCreateEvent } from "../events/employeeCreatedEvents";
import { EmployeeUpdatedEvent } from "../events/employeeUpdatedEvents";
import { UserCreateEvent } from "../events/userCreatedEvents";
import { userUpdatedEvents } from "../events/userUpdatedEvents";
import { Topics } from "../topics/topics";


export class UserCreatedPublisher extends Publisher<UserCreateEvent>{
    topic: Topics.userCreated = Topics.userCreated;
}
export class EmployeeCreatedPublisher extends Publisher<EmployeeCreateEvent>{
    topic: Topics.employeeCreated = Topics.employeeCreated;
}
export class EmployeeUpdatedPublisher extends Publisher<EmployeeUpdatedEvent>{
    topic: Topics.employeeUpdated = Topics.employeeUpdated;
}
export class UserUpdatedPublisher extends Publisher<userUpdatedEvents>{
    topic: Topics.userUpdated = Topics.userUpdated;
}