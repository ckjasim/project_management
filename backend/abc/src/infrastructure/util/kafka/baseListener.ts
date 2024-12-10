import { Consumer } from "kafkajs";
import { Topics } from "./topics/topics";


interface Event {
    topic: Topics,
    data: any;
}

export abstract class KafkaConsumer <T extends Event>{
    abstract topic:T['topic'];
    abstract groupId:string;
    protected consumer:Consumer;

    constructor(consumer:Consumer) {
        this.consumer = consumer
    }

    async listen():Promise<void>{
        try {
            await this.consumer.subscribe({
                topic: this.topic,
                fromBeginning: true
            });

 
            await this.consumer.run({
                eachMessage: async ({ message }) => {
                    if (!message.value) {
                        console.log('Empty message received');
                        return;
                    }

                    try {
                        const data = JSON.parse(message.value.toString());
                       
                     
                        await this.onMessage(data);
                        
                    } catch (error) {
                        console.error('Error processing message:', error);
                    }
                }
            });
        } catch (error) {
            
        }
    }
    abstract onMessage(data:T['data']):Promise<void>
  }