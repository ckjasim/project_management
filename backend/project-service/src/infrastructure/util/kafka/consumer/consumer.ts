
import { Consumer } from "kafkajs";
import { KafkaConsumer } from "../baseListener";
import { Topics } from "../topics/topics";
import { UserModel } from "../../../../database/model/userModel";
import { EmployeeModel } from "../../../../database/model/employeeModel";
import { UserCreateEvent } from "../events/userCreatedEvents";
import { EmployeeCreateEvent } from "../events/employeeCreatedEvents";


export class UserCreateConsumer extends KafkaConsumer<UserCreateEvent>{
 
    topic: Topics.userCreated = Topics.userCreated;
    groupId: string = "user-created";
    constructor(consumer:Consumer){
        super(consumer)
    }

    async onMessage(data: { _id: string; name: string; email: string; organization: string; role: string;  }): Promise<void> {
        try {
            console.log(data,'popopo--------------------')
            await UserModel.create(data)
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}
export class EmployeeCreateConsumer extends KafkaConsumer<EmployeeCreateEvent>{
 
    topic: Topics.employeeCreated = Topics.employeeCreated;
    groupId: string = "employee-created";
    constructor(consumer:Consumer){
        super(consumer)
    }

    async onMessage(data: { _id: string; name: string; email: string; organization: string; role: string;  }): Promise<void> {
        try {
            console.log(data,'piippii--------------------')
            await EmployeeModel.create(data)
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}