import { NextFunction, Request, Response } from "express";


export default interface IController {
  createMeetingHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getMeetingsHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
} 
