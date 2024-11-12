import { NextFunction, Request, Response } from "express";

export default interface IAdminController {
    loginHandler(req: Request, res: Response,next:NextFunction): Promise<void>;
    getAllUsers(req: Request, res: Response,next:NextFunction): Promise<void>;
    getAllEmployees(req: Request, res: Response,next:NextFunction): Promise<void>;
    manageUser(req: Request, res: Response,next:NextFunction): Promise<void>;
    manageEmployee(req: Request, res: Response,next:NextFunction): Promise<void>;

  
}