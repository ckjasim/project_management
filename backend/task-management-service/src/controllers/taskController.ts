import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
// import IJwt from '../infrastructure/interfaces/IJwt';
// import { COOKIE_MAXAGE } from '../infrastructure/constants/timeAndDuration';
import ITaskController from '../infrastructure/interfaces/ITaskController';
import { ITaskInteractor } from '../infrastructure/interfaces/ITaskInteractors';
import IJwt from '../infrastructure/interfaces/IJwt';

@injectable()
class taskController implements ITaskController {
  private interactor: ITaskInteractor;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.TaskInteractor) taskInter: ITaskInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
  ) {
    this.interactor = taskInter;
    this.jwt = jwt;
  }
  getTasksByProjectIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }

   async createTaskHandler(req:Request,res:Response,next:NextFunction){
    try {
      console.log(req.body)
      const {topic , summary, description,dueDate,status}=req.body
      const token = req.cookies['jwt'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      const decodedData = await this.jwt.verifyToken(token);
      const { projectCode } = decodedData;
      const data={
        projectCode,
        topic ,
        summary,
        description,
        dueDate,
        status
      }
      const alreadyTask =await this.interactor.getTaskByProjectCode(projectCode)
      if(alreadyTask){
        this.interactor.addTask(data)
      }else{
        const newTask= this.interactor.createTask(data)

      }
    } catch (error) {
      next(error);
    }
 }
  async getTasksByProjectCodeHandler(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
    const token = req.cookies['jwt'];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decodedData = await this.jwt.verifyToken(token);
    const { projectCode } = decodedData;
    const tasks=await this.interactor.getTaskByProjectCode(projectCode)
      res.status(200).send({message:'task successfull found',tasks:tasks})
      // console.log('eeeeeeeeeeeeeee')
      // res.status(200).send({message:'task successfull found'})
    } catch (error) {
      next(error);
    }
  }
  getTaskByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  changeTaskStatusHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }


}

export default taskController;
