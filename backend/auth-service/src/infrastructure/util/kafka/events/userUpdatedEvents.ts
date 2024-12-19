
import { Topics } from "../topics/topics";

export interface userUpdatedEvents {
    topic: Topics.userUpdated;
    data: {
        _id: string;
        isBlock:any

    };
}
