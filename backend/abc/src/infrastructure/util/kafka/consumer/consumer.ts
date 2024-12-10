
import { Consumer } from "kafkajs";
import { KafkaConsumer } from "../baseListener";
import { Topics } from "../topics/topics";
// import { UserModel } from "../../../../database/model/userModel";
import { UserCreateEvent } from "../events/userCreatedEvents";
import { EmployeeCreateEvent } from "../events/employeeCreatedEvents";
import { ProjectCreateEvent } from "../events/ProjectCreateEvent";
import { ProjectModel } from "../../../../database/model/projectModel";
import { TeamCreateEvent } from "../events/teamCreatedEvents";
import { TeamModel } from "../../../../database/model/teamModel";
import { EmployeeModel } from "../../../../database/model/employeeModel";


// export class UserCreateConsumer extends KafkaConsumer<UserCreateEvent>{
 
//     topic: Topics.userCreated = Topics.userCreated;
//     groupId: string = "user-created";
//     constructor(consumer:Consumer){
//         super(consumer)
//     }

//     async onMessage(data: { _id: string; name: string; email: string; organization: string; role: string;  }): Promise<void> {
//         try {
//             console.log(data,'popopo--------------------')
//             await UserModel.create(data)
//         } catch (error) {
//             console.error('Error processing message:', error);
//             throw error;
//         }
//     }
// }
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
export class TeamCreateConsumer extends KafkaConsumer<TeamCreateEvent>{

    topic: Topics.teamCreated = Topics.teamCreated;
    groupId: string = "team-created";
    constructor(consumer:Consumer){
        super(consumer)
    }

async onMessage(data: {_id: string;
    name: string,
    organization: string,
    projectManager: string,
    members: any,}): Promise<void> {
        try {
            console.log(data,'piippii--------------------')
            await TeamModel.create(data)
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}
export class ProjectCreateConsumer extends KafkaConsumer<ProjectCreateEvent>{
 
    topic: Topics.projectCreated = Topics.projectCreated;
    groupId: string = "project-created";
    constructor(consumer:Consumer){
        super(consumer)
    }


    async onMessage(data: { _id: string;  title: string;
      priority: string;
      description?: string;
      organization: string;
      teams:[];
      projectManager:string;
      startDate?: Date;
      dueDate: Date;
      eventHistory?: Record<string, any>;}): Promise<void> {
        try {
            console.log(data,'piippii--------------------')
            await ProjectModel.create(data)
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}