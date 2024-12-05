

import { Publisher } from "../basePublisher";
import { UserCreateEvent } from "../events/userCreatedEvents";
import { Topics } from "../topics/topics";


export class UserCreatedPublisher extends Publisher<UserCreateEvent>{
    topic: Topics.userCreated = Topics.userCreated;
}
export class EmployeeCreatedPublisher extends Publisher<UserCreateEvent>{
    topic: Topics.userCreated = Topics.userCreated;
}