import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import ITaskController from '../infrastructure/interfaces/ITaskController';
import { ITaskInteractor } from '../infrastructure/interfaces/ITaskInteractors';
import IJwt from '../infrastructure/interfaces/IJwt';

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
      const createdTask = await this.interactor.createTask(req.body?.data);


      res
        .status(201)
        .json({ message: 'Task created successfully', createdTask });
    } catch (error) {
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
console.log(userId)
const teamId =await this.interactor.getTeamIdByUserId(userId)
 
      const tasks=await this.interactor.getTaskByProjectId(projectId,teamId)
      console.log(tasks)

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
      console.log(userId)
      const teamId =await this.interactor.getTeamIdByUserId(userId)
      console.log(teamId,'tamid-------------------')
      const projects=await this.interactor.getProjectsByTeamId(teamId)
      console.log(projects)

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
      console.log(req.body);
      const { taskId, status } = req.body;
      console.log(taskId, status.status, 'dddddddddddddddddddddddddd');
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
      const { title: topic, description, summary, dueDate } = data;
      const task = { topic, description, summary, dueDate };
      const tasks = await this.interactor.updateTask(id, task);

      res.status(200).send({ message: 'Tasks successfully updated' });
    } catch (error) {
      next(error);
    }
  }
}

export default TaskController;
