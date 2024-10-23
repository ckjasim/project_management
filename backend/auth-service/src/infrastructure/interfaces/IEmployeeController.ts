import { NextFunction, Request, Response } from "express";

export default interface IEmployeeController {
    loginHandler(req: Request, res: Response,next:NextFunction): Promise<void>;
    registerHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    verifyOtpHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    refreshToken(req: Request, res: Response,next:NextFunction): Promise<any>;
    resendOtp(req: Request, res: Response,next:NextFunction): Promise<any>;
}