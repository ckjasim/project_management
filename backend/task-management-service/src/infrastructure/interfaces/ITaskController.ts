import { NextFunction, Request, Response } from "express";
import IProject from "./IProject";

export default interface ITaskController {
  createTaskHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTasksByTeamHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTaskByProjectIdHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  
  addCommentsHandler(req: Request, res: Response, next: NextFunction): Promise<any>;

  
  updateTaskStatusHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  deleteTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void>;



  getProjectByTeamHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
}
