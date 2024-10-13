import { NextFunction, Request, Response } from "express";

export default interface IAdminController {
    loginHandler(req: Request, res: Response,next:NextFunction): Promise<void>;
    getAllUsers(req: Request, res: Response,next:NextFunction): Promise<void>;
    getAllEmployees(req: Request, res: Response,next:NextFunction): Promise<void>;
    blockUser(req: Request, res: Response,next:NextFunction): Promise<void>;
    blockEmployee(req: Request, res: Response,next:NextFunction): Promise<void>;
    unBlockUser(req: Request, res: Response,next:NextFunction): Promise<void>;
    unBlockEmployee(req: Request, res: Response,next:NextFunction): Promise<void>;

  
}