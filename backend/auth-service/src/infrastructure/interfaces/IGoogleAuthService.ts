import { Request, Response, NextFunction } from "express";

export default interface IGoogleAuthService {
    googleAuth(req: Request, res: Response, next: NextFunction): void;
    googleCallback(req: Request, res: Response, next: NextFunction): void;
}
