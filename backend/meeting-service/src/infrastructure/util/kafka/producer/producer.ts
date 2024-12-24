

import { Publisher } from "../basePublisher";
import { TaskCreateEvent } from "../events/taskCreatedEvents";
import { UserCreateEvent } from "../events/userCreatedEvents";

import { Topics } from "../topics/topics";


export class TaskCreatedPublisher extends Publisher<TaskCreateEvent>{
    topic: Topics.taskCreated = Topics.taskCreated;
}
// export class EmployeeCreatedPublisher extends Publisher<UserCreateEvent>{
//     topic: Topics.userCreated = Topics.userCreated;
// }