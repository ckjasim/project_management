
import { Topics } from "../topics/topics";

export interface TeamCreateEvent {
    topic: Topics.teamCreated;
    data: {
        _id: string;
        name: string;
        organization: string;
        projectManager: string;
        members: any;
    };
}
