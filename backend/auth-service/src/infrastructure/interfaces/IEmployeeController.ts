import { NextFunction, Request, Response } from "express";

export default interface IEmployeeController {
    loginHandler(req: Request, res: Response,next:NextFunction): Promise<void>;
    employeeInvitation(req: Request, res: Response,next:NextFunction): Promise<void>;
    verifyInvitationHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    registerHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    employeeByOrganization(req: Request, res: Response,next:NextFunction): Promise<any>;
}