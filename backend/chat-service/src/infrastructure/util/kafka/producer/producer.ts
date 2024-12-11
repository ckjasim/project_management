

import { Publisher } from "../basePublisher";
import { ChatCreateEvent } from "../events/chatCreatedEvents";

import { Topics } from "../topics/topics";



export class ChatCreatedPublisher extends Publisher<ChatCreateEvent>{
    topic: Topics.chatCreated = Topics.chatCreated;
}
