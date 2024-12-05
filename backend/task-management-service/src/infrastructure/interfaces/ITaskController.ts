import { NextFunction, Request, Response } from "express";

export default interface ITaskController {
  createTaskHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTasksByTeamHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  updateTaskStatusHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  deleteTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
}
