
import { Topics } from "../topics/topics";

export interface TeamCreateEvent {
    topic: Topics.teamCreated;
    data: {
        _id: string;
        name: string;
        organization: any;
        projectManager: any;
        members: any;
    };
}
 