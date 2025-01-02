import { NextFunction, Request, Response } from "express";

export default interface IUserController {
    loginHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    registerHandler(req: Request, res: Response,next:NextFunction): Promise<void>;
    verifyOtpHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    refreshToken(req: Request, res: Response,next:NextFunction): Promise<any>;
    resendOtp(req: Request, res: Response,next:NextFunction): Promise<any>;
    logoutHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    authRole(req: Request, res: Response,next:NextFunction): Promise<any>;
    updateSubscriptionHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    getAccessTokenHandler(req: Request, res: Response,next:NextFunction): Promise<any>;
    checkPremiumHandler(req: Request, res: Response,next:NextFunction): Promise<any>;

}