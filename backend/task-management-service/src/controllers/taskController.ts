import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import ITaskController from '../infrastructure/interfaces/ITaskController';
import { ITaskInteractor } from '../infrastructure/interfaces/ITaskInteractors';
import IJwt from '../infrastructure/interfaces/IJwt';
import { TaskCreatedPublisher } from '../infrastructure/util/kafka/producer/producer';
import kafkaWrapper from '../infrastructure/util/kafka/kafkaWrapper';
import { Producer } from 'kafkajs';
import CloudinaryV2 from '../infrastructure/util/cloudinary';


@injectable()
class TaskController implements ITaskController {
  private interactor: ITaskInteractor;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.TaskInteractor) taskInter: ITaskInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt
  ) {
    this.interactor = taskInter;
    this.jwt = jwt;
  }

  getTasksByProjectIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async createTaskHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        project,
        team,
        title,
        description,
        assignedTo,
        status,
        priority,
        dueDate,
        attachments,
      } = req.body.data;
  

  

      const uploadedFiles = [];
  console.log(req.body)
      if (attachments && attachments.length > 0) {
        for (const base64 of attachments) {
          try {
            const uploadResponse = await CloudinaryV2.uploader.upload(base64.file , {
              folder: 'attachments',
            });
  
            uploadedFiles.push({
              name:base64.name,
              public_id: uploadResponse.public_id,
              url: uploadResponse.secure_url,
              size: uploadResponse.bytes,
              
            });
  
            console.log(uploadResponse, '------------------------------');
          } catch (uploadError) {
            console.error('File upload failed:', uploadError);
            throw new Error('Failed to upload attachments.');
          }
        }
      }
  

      const data = {
        project,
        team,
        title,
        description,
        assignedTo,
        status,
        priority,
        dueDate,
        attachments: uploadedFiles, 
      };
  

      const createdTask = await this.interactor.createTask(data);
  
      if (createdTask) {
        const { _id } = createdTask;
  

        await new TaskCreatedPublisher(kafkaWrapper.producer as Producer).produce({
          _id: _id as string,
          project: project as unknown as string,
          team: team as unknown as string,
          title,
          description,
          assignedTo: assignedTo as unknown as string,
          status,
          priority,
          dueDate,
        });
      }
  

      res.status(201).json({ message: 'Task created successfully', createdTask });
    } catch (error) {
      console.error('Error in createTaskHandler:', error);
      next(error); 
    }
  }
  

  async getTasksByTeamHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
const {teamId,projectId}=req.body
      const tasks = await this.interactor.getTasksByTeam(teamId,projectId);
      res.status(200).send({ message: 'Tasks successfully found', tasks });
    } catch (error) {
      next(error);
    }
  }



  async getTaskByProjectIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {

const projectId=Object.keys(req.body)[0];

const token = req.cookies['jwt'];
if (!token) {
  return res.status(401).json({ message: 'No token provided' });
}
let decodedData;
try {
  decodedData = await this.jwt.verifyRefreshToken(token);
} catch (error) {
  return res.status(401).json({ message: 'Invalid or expired token' });
}
const { user } = decodedData;
const userId = user._id;

const teamId =await this.interactor.getTeamIdByUserId(userId)
 
      const tasks=await this.interactor.getTaskByProjectId(projectId,teamId)
     

      res.status(200).send({ message: 'Tasks successfully found', tasks });
    } catch (error) {
      next(error);
    }
  }




  async getProjectByTeamHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {

      const token = req.cookies['jwt'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      let decodedData;
      try {
        decodedData = await this.jwt.verifyRefreshToken(token);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      const { user } = decodedData;
      const userId = user._id;

      const teamId =await this.interactor.getTeamIdByUserId(userId)

      const projects=await this.interactor.getProjectsByTeamId(teamId)
  

      res.status(200).send({ message: 'Tasks successfully found', projects });
    } catch (error) {
      next(error);
    }
  }

















  async updateTaskStatusHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      
      const { taskId, status } = req.body;
      console.log(taskId, status.status,'dddddddddddddddddddddddddd');
      const tasks = await this.interactor.updateTaskStatus(
        taskId,
        status.status
      );

      res.status(200).send({ message: 'Tasks successfully updataed' });
    } catch (error) {
      next(error);
    }
  }

  async deleteTaskHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try { 
      console.log(req.body);
      const { id } = req.body;
      console.log(id, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
      const tasks = await this.interactor.deleteTask(id);

      res.status(200).send({ message: 'Tasks successfully deleted' });
    } catch (error) {
      next(error);
    }
  }

  async updateTaskHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {  
      console.log(req.body);  
      const { id, data } = req.body;
      console.log(id, 'rrrrrrrrrrrrrrrrrrrrrrrr');
      
      const tasks = await this.interactor.updateTask(id, data);
      console.log(tasks,'--------------ddd')

      res.status(200).send({ message: 'Tasks successfully updated',tasks });
    } catch (error) {
      next(error);
    }
  }
  async addCommentsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {  
      const {_id,role}  = JSON.parse(req.headers['user'] as string)
      let authorModel
 
      const { content, taskId } = req.body;
        if(role==='employee'){
          authorModel='Employee'
        }else if(role==='project manager'){
          authorModel='User'
        }
      const payload={
        author:_id,
        content,
        authorModel
      }
      const comment = await this.interactor.addComment(taskId, payload);


      res.status(200).send({ message: 'comment added successfully', comment});
    } catch (error) {
      next(error);
    }
  }
}

export default TaskController;
