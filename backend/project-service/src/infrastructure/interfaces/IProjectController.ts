import { NextFunction, Request, Response } from "express";

export default interface IProjectController {
  createProjectHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getProjectsHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getProjectByProjectCodeHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTeamMembersByProjectCodeHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  updateProjectHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  deleteProjectHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  createTeamHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
  getTeamsHandler(req: Request, res: Response, next: NextFunction): Promise<any>;
}
