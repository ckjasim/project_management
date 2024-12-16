
import { Consumer } from "kafkajs";
import { KafkaConsumer } from "../baseListener";
import { Topics } from "../topics/topics";
import { UserModel } from "../../../../database/model/userModel";
import { EmployeeModel } from "../../../../database/model/employeeModel";
import { UserCreateEvent } from "../events/userCreatedEvents";
import { EmployeeCreateEvent } from "../events/employeeCreatedEvents";
import { TeamModel } from "../../../../database/model/teamModel";
import { TaskCreateEvent } from "../events/taskCreatedEvents";
import { io } from "../../../../server";
import { notificationSockets } from "../../../constants/socketStore";
import { ChatCreateEvent } from "../events/chatCreatedEvents";
import { TeamCreateEvent } from "../events/teamCreatedEvents";
import { NotificationModel } from "../../../../database/model/notificationModel";


export class UserCreateConsumer extends KafkaConsumer<UserCreateEvent>{
 
    topic: Topics.userCreated = Topics.userCreated;
    groupId: string = "user-created-for-notification";
    constructor(consumer:Consumer){
        super(consumer)
    }

    async onMessage(data: { _id: string; name: string; email: string; organization: string; role: string;  }): Promise<void> {
        try {
            console.log(data,'popopo--------------------')
 
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}
export class EmployeeCreateConsumer extends KafkaConsumer<EmployeeCreateEvent>{
 
    topic: Topics.employeeCreated = Topics.employeeCreated;
    groupId: string = "employee-created-for-notification";
    constructor(consumer:Consumer){
        super(consumer)
    }

    async onMessage(data: { _id: string; name: string; email: string; organization: string; role: string; projectManager:string }): Promise<void> {
        try {
            console.log(data,'piippii--------------------')
            const newNotification = {
                userId: data?.projectManager,
                type: "employee_created",
                data:data,
                isRead: false
              }
             const res = await NotificationModel.create(newNotification)
            } catch (err) {
              console.error("Error saving notification:", err);
            }
            const projectManagerSocketId = notificationSockets.get(data.projectManager);
            if(projectManagerSocketId)
            io.to(projectManagerSocketId).emit('new_employee', data); 
            console.log('send aayind')
        } catch (error: any) {
            console.error('Error processing message:', error);
            throw error;
        }
    }

export class TaskCreateConsumer extends KafkaConsumer<TaskCreateEvent>{

    topic: Topics.taskCreated = Topics.taskCreated;
    groupId: string = "task-created-for-notification";
    constructor(consumer:Consumer){
        super(consumer)
    }

async onMessage(data: { _id:string;project: string;
    team: string;
    title: string;
    description: string;
    assignedTo: string;
    status?: 'pending' | 'progressing' | 'review' | 'completed';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    dueDate: Date;}): Promise<void> {
        try {
            console.log(data,'piippii--------------------')
            try{
            const newNotification = {
                userId: data?.assignedTo,
                type: "new_task",
                data:data,
                isRead: false
              }
             const res = await NotificationModel.create(newNotification)
            } catch (err) {
              console.error("Error saving notification:", err);
            }
            const employeeSocketId = notificationSockets.get(data?.assignedTo);
            if(employeeSocketId)
            io.to(employeeSocketId).emit('new_task', data); 
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}
export class ChatCreateConsumer extends KafkaConsumer<ChatCreateEvent>{

    topic: Topics.chatCreated = Topics.chatCreated;
    groupId: string = "chat-created-for-notification";
    constructor(consumer:Consumer){
        super(consumer)
    }

async onMessage(data: {  _id: string;
    content: string,
    id: string ,
    recipientId: string,
    roomId: string,
    senderId: string,
    senderName: string,
    type:string}): Promise<void> {
        try {
            console.log(data,'piippii--------------------')
            if(data.recipientId){
                try{
                const newNotification = {
                    userId: data?.recipientId,
                    type: "private_chat",
                    data:data,
                    isRead: false
                  }
                 const res = await NotificationModel.create(newNotification)
                } catch (err) {
                  console.error("Error saving notification:", err);
                }
                const chatSocketId = notificationSockets.get(data?.recipientId);
                if(chatSocketId)
                io.to(chatSocketId).emit('new_chat', data); 
            }else{
                const team= await TeamModel.findOne({_id:data.roomId})
                team?.members.map(async (member)=>{
                    if( member.toString() !== data.senderId){
                        try{
                            const newNotification = {
                                userId: member.toString() ,
                                type: "private_chat",
                                data:data,
                                isRead: false
                              }
                             const res = await NotificationModel.create(newNotification)
                            } catch (err) {
                              console.error("Error saving notification:", err);
                            }
                    const groupSocketId=notificationSockets.get(member.toString());
                    if(groupSocketId)
                    io.to(groupSocketId).emit('new_chat', data); 
                    }
                })
            }
           
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}

export class TeamCreateConsumer extends KafkaConsumer<TeamCreateEvent>{

    topic: Topics.teamCreated = Topics.teamCreated;
    groupId: string = "team-created-for-notification";
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