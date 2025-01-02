import { NextFunction, Request, Response } from "express";


export default interface IController {
  //meeting
  createMeetingHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getMeetingsHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  deleteMeetingHandler(req: Request, res: Response, next: NextFunction): Promise<any>;

// payment
paymentHandler(req: Request, res: Response, next: NextFunction): any;
webhookHandler(req: Request, res: Response, next: NextFunction): any;
listDriveFiles(req: Request, res: Response, next: NextFunction): any;


} 
