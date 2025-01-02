import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import { IProjectInteractor } from '../infrastructure/interfaces/IProjectInteractor';
import IJwt from '../infrastructure/interfaces/IJwt';
import IProjectController from '../infrastructure/interfaces/IProjectController';
import { Types } from 'mongoose';
import { ProjectCreatedPublisher, TeamCreatedPublisher } from '../infrastructure/util/kafka/producer/producer';
import { Producer } from 'kafkajs';
import kafkaWrapper from '../infrastructure/util/kafka/kafkaWrapper';

@injectable()
class ProjectController implements IProjectController {
  private interactor: IProjectInteractor;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.ProjectInteractor) projectInter: IProjectInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt
  ) {
    this.interactor = projectInter;
    this.jwt = jwt;
  }

  async getTeamsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
    
      const user  = JSON.parse(req.headers['user'] as string)
      const projectManager = user?._id;

      const teams = await this.interactor.getTeamsByprojectManager(
        projectManager,
        user?.organization
      );
      res.status(200).send({ message: 'Teams successfully found', teams });
    } catch (error) {
      next(error);
    }
  }
  async getTeamsByProjectHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const id = Object.keys(req.body);
      const projectId = id[0];

      const token = req.cookies['jwt'];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      let decodedData;
      try {
        decodedData = await this.jwt.verifyRefreshToken(token);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const { organization } = decodedData.user;

      const teams = await this.interactor.getTeamsByProject(
        projectId,
        organization
      );
      console.log(teams);

      res.status(200).send({ message: 'Teams successfully found', teams });
    } catch (error) {
      next(error);
    }
  }
  async addTeamMemberHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {;
      console.log(req.body)
     const {id,data}=req.body

      const createdTeam = await this.interactor.updateTeamMembers(id, data.employees);
      // if (createdTeam) {
      //   await new TeamCreatedPublisher(
      //     kafkaWrapper.producer as Producer
      //   ).produce({
      //     _id:createdTeam._id as string,
      //     name: createdTeam.name as string,
      //     organization:createdTeam.organization,
      //     projectManager:createdTeam.projectManager,
      //     members:createdTeam.members 
      //   });
      // }
      // console.log('sendeddddd')

      res
        .status(201)
        .json({ message: 'member added successfully', createdTeam });
    } catch (error) {
      next(error);
    }
  }
  async createTeamHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {;
      const { title, employees } = req.body.data;

      const token = req.cookies['jwt'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      let decodedData;
      try {
        decodedData = await this.jwt.verifyRefreshToken(token);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const { user } = decodedData;

      const organization = user.organization;
      const data = {
        name: title,
        members: employees,
        organization,
        projectManager: user?._id,
      };

      const createdTeam = await this.interactor.createTeam(data);
      
      if (createdTeam) {
        await new TeamCreatedPublisher(
          kafkaWrapper.producer as Producer
        ).produce({
          _id:createdTeam._id as string,
          name: createdTeam.name as string,
          organization:createdTeam.organization,
          projectManager:createdTeam.projectManager,
          members:createdTeam.members 
        });
      }
      console.log('sendeddddd')

      res
        .status(201)
        .json({ message: 'Team created successfully', createdTeam });
    } catch (error) {
      next(error);
    }
  }
  async createProjectHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      console.log(req.body);
      const { title, description, dueDate, priority, teams } = req.body.data;
      const token = req.cookies['jwt'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      let decodedData;
      try {
        decodedData = await this.jwt.verifyRefreshToken(token);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      const { _id, organization } = decodedData.user;

      const data = {
        projectManager: _id,
        title,
        teams,
        priority,
        organization,
        description,
        dueDate,
      };

      const createdProject = await this.interactor.createProject(data);
      const {
        projectManager,
        startDate,
        organization: org,
        teams: tms,
      } = createdProject;

      if (createdProject) {
        await new ProjectCreatedPublisher(
          kafkaWrapper.producer as Producer
        ).produce({
          _id: createdProject._id! as string,
          priority: priority as string,
          description: description as string,
          organization: org,
          teams: tms,
          projectManager: projectManager,
          dueDate: dueDate as Date,
          title: title,
        });
      }

      res
        .status(201)
        .json({ message: 'Project created successfully', createdProject });
    } catch (error) {
      next(error);
    }
  }
  async getTeamMembersByTeamIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const id = Object.keys(req.body);
      const teamId = id[0];

      const teamMembers = await this.interactor.getTeamMembersByTeamId(teamId);
      console.log(teamMembers)
      res
        .status(200)
        .send({ message: 'projects successfully found', teamMembers });
    } catch (error) {
      next(error);
    }
  }
  async getProjectByProjectCodeHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const token = req.cookies['jwt'];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      let decodedData;
      try {
        decodedData = await this.jwt.verifyRefreshToken(token);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const { user } = decodedData;
      const projectCode = user?.projectCode;

      const project = await this.interactor.getProjectsByProjectCode(
        projectCode
      );
      console.log(project, 'haaaiii');

      res.status(200).send({ message: 'projects successfully found', project });
    } catch (error) {
      next(error);
    }
  }
  async getProjectsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const token = req.cookies['jwt'];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      let decodedData;
      try {
        decodedData = await this.jwt.verifyRefreshToken(token);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const { _id, organization } = decodedData.user;

      const projects = await this.interactor.getProjectsByProjectManager(
        _id,
        organization
      );

      res
        .status(200)
        .send({ message: 'projects successfully found', projects });
    } catch (error) {
      next(error);
    }   
  }
  async updateProjectHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      console.log(req.body);
      const { id, data } = req.body;
      console.log(id, 'pppppppppp');
      const { title, summary, description, dueDate, status, teamId } = data;
      const project = { title, summary, description, dueDate, status, teamId };
      const editedProject = await this.interactor.updateProject(id, project);

      res
        .status(200)
        .send({ message: 'projects successfully updated', editedProject });
    } catch (error) {
      next(error);
    }
  }
  async deleteProjectHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body);
      const { id } = req.body.data;
      console.log(id, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
      const project = await this.interactor.deleteProject(id);

      res.status(200).send({ message: 'project successfully deleted' });
    } catch (error) {
      next(error);
    }
  }

  //   async updateTaskStatusHandler(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<any> {
  //     try {
  //       console.log(req.body)
  //       const { taskId, status } = req.body;
  // console.log(taskId,status.status,'dddddddddddddddddddddddddd')
  //       const tasks = await this.interactor.updateTaskStatus(taskId, status.status);

  //       res.status(200).send({ message: 'Tasks successfully updataed'});
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}

export default ProjectController;
