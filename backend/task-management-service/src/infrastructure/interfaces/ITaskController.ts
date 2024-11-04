import { NextFunction, Request, Response } from "express";

export default interface ITaskController {
  createTaskHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTasksByProjectCodeHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTasksByProjectIdHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTaskByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTaskStatusHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  deleteTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeTaskStatusHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
}
