
import { Topics } from "../topics/topics";

export interface ChatCreateEvent {
    topic: Topics.chatCreated;
    data: {
        _id: string;
        content: string,
        id: string ,
        recipientId: string,
        roomId: string,
        senderId: string,
        senderName: string,
        type:string

    };
}
