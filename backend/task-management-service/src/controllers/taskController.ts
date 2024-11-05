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
      const {
        title: topic,
        summary,
        description,
        dueDate,
        status,
      } = req.body.data;
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
      const { projectCode, email } = decodedData.user;
      const data = {
        projectCode,
        topic,
        summary,
        description,
        dueDate,
        status,
      };
  
      const createdTask = await this.interactor.createTask(data);
      console.log(createdTask, 'ppppppppppppppppppppppppppppp');
 

      res
        .status(201)
        .json({ message: 'Task created successfully', createdTask });
    } catch (error) {
      next(error);
    }
  }

  async getTasksByProjectCodeHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const token = req.cookies['jwt'];
      console.log(token);
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
      const projectCode = user.projectCode;

      const tasks = await this.interactor.getTaskByProjectCode(projectCode);
      res.status(200).send({ message: 'Tasks successfully found', tasks });
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
      console.log(req.body)
      const { taskId, status } = req.body;
console.log(taskId,status.status,'dddddddddddddddddddddddddd')
      const tasks = await this.interactor.updateTaskStatus(taskId, status.status);
     
      res.status(200).send({ message: 'Tasks successfully updataed'});
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
      console.log(req.body)
      const { id } = req.body;
console.log(id,'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
      const tasks = await this.interactor.deleteTask(id);
     
      res.status(200).send({ message: 'Tasks successfully deleted'});
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
      console.log(req.body)
      const { id ,data} = req.body;
console.log(id,'rrrrrrrrrrrrrrrrrrrrrrrr')
const{title:topic,description,summary,dueDate}=data
const task={topic,description,summary,dueDate}
      const tasks = await this.interactor.updateTask(id,task);
     
      res.status(200).send({ message: 'Tasks successfully updated'});
    } catch (error) {
      next(error);
    }
  }
}

export default TaskController;
