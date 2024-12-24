
import { Consumer } from "kafkajs";
import { KafkaConsumer } from "../baseListener";
import { Topics } from "../topics/topics";
// import { UserModel } from "../../../../database/model/userModel";
import { UserCreateEvent } from "../events/userCreatedEvents";
import { EmployeeCreateEvent } from "../events/employeeCreatedEvents";
// import { ProjectCreateEvent } from "../events/ProjectCreateEvent";
import { TeamCreateEvent } from "../events/teamCreatedEvents";
import { TeamModel } from "../../../../database/model/teamModel";
import { EmployeeModel } from "../../../../database/model/employeeModel";
import { employeeUpdatedEvent } from "../events/employeeUpdatedEvents";
import { UserUpdatedEvent } from "../events/userUpdatedEvents";
import { UserModel } from "../../../../database/model/userModel";


export class UserCreateConsumer extends KafkaConsumer<UserCreateEvent>{
 
    topic: Topics.userCreated = Topics.userCreated;
    groupId: string = "user-created-for-task";
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
    groupId: string = "employee-created-for-task";
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
    groupId: string = "team-created-for-task";
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
// export class ProjectCreateConsumer extends KafkaConsumer<ProjectCreateEvent>{
 
//     topic: Topics.projectCreated = Topics.projectCreated;
//     groupId: string = "project-created-for-task";
//     constructor(consumer:Consumer){
//         super(consumer)
//     }


//     async onMessage(data: { _id: string;  title: string;
//       priority: string;
//       description?: string;
//       organization: string;
//       teams:[];
//       projectManager:string;
//       startDate?: Date;
//       dueDate: Date;
//       eventHistory?: Record<string, any>;}): Promise<void> {
//         try {
//             console.log(data,'piippii--------------------')
//             await ProjectModel.create(data)
//         } catch (error) {
//             console.error('Error processing message:', error);
//             throw error;
//         }
//     }
// }

export class UserUpdatedConsumer extends KafkaConsumer<UserUpdatedEvent>{
 
    topic: Topics.userUpdated = Topics.userUpdated;
    groupId: string = "user-updated-for-chat";
    constructor(consumer:Consumer){
        super(consumer)
    }

    async onMessage(data: { _id: string; isBlock:any  }): Promise<void> {
        try {
            console.log(data,'popopo--------------------')
            await UserModel.findOneAndUpdate({_id:data._id},{isBlock:data.isBlock})
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}

export class EmployeeUpdatedConsumer extends KafkaConsumer<employeeUpdatedEvent>{
 
    topic: Topics.employeeUpdated = Topics.employeeUpdated;
    groupId: string = "employee-updated-for-task";
    constructor(consumer:Consumer){
        super(consumer)
    }

    async onMessage(data: { _id: string; isBlock:any  }): Promise<void> {
        try {
            console.log(data,'popopo--------------------')
            await EmployeeModel.findOneAndUpdate({_id:data._id},{isBlock:data.isBlock})
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}