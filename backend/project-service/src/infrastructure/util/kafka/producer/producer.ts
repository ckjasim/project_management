

import { Publisher } from "../basePublisher";
import { ProjectCreateEvent } from "../events/ProjectCreateEvent";
import { TeamCreateEvent } from "../events/teamCreatedEvents";
import { Topics } from "../topics/topics";



export class ProjectCreatedPublisher extends Publisher<ProjectCreateEvent>{
    topic: Topics.projectCreated = Topics.projectCreated;
}
export class TeamCreatedPublisher extends Publisher<TeamCreateEvent>{
    topic: Topics.teamCreated = Topics.teamCreated;
}