import { Producer } from "kafkajs";
import { Topics } from "./topics/topics";

interface Events {
    topic: Topics;
    data: any;
}

export  abstract class Publisher<T extends Events> {
    abstract topic: T['topic'];
    protected producer: Producer;
    constructor(producer: Producer){
        this.producer = producer
    };
    async produce(data: T['data']): Promise<void>{
        try {
            await this.producer.send({
                topic: this.topic,
                messages: [
                    {
                        value: JSON.stringify(data)
                    }
                ]
            });
            console.log("sending completed");
            
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }
}