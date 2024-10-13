import { NextFunction, Request, Response } from "express";

export default interface IUserController {
    loginHandler(req: Request, res: Response,next:NextFunction): Promise<void>;
    registerHandler(req: Request, res: Response,next:NextFunction): Promise<void>;
    verifyOtpHandler(req: Request, res: Response,next:NextFunction): Promise<void>;
}