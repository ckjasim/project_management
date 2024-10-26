import { NextFunction, Request, Response } from "express";

export default interface ITaskController {
  createTaskHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTasksByProjectCodeHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTasksByProjectIdHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTaskByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeTaskStatusHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
}
