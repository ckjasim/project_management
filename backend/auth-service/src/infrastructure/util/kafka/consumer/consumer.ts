import { Consumer, Producer } from "kafkajs";
import { KafkaConsumer } from "../baseListener";
import { UserCreateEvent } from "../events/userCreatedEvents";
import { Topics } from "../topics/topics";
import  {UserModel}  from "../../../../database/model/userModel";
import kafkaWrapper from "../kafkaWrapper";
import { InstructorAprovedEvent } from "../events/instructorApprovedEvents";



export class InstructorAprovalConsumer extends KafkaConsumer<InstructorAprovedEvent>{
    topic: Topics.instructorAproval = Topics.instructorAproval;
    groupId: string = "order-instructor-aproval-group";
   
    constructor(consumer:Consumer){
        super(consumer)
    }
    async onMessage(data: { _id: string; name: string; email: string; isInstructor: boolean; }): Promise<void> {
        try {
            console.log('Consumer received message user from user service :', data);
            const {email,isInstructor} = data
            // Adding userDta to db in course Service
             await UserModel.findOneAndUpdate({email:email},{$set:{isInstructor:isInstructor}},{new:true});
            
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}
