// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';
import ITaskRepository from '../infrastructure/interfaces/ITaskRepository';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import { ITaskInteractor } from '../infrastructure/interfaces/ITaskInteractors';
import ITask from '../infrastructure/interfaces/ITask';
import IRefreshToken from '../infrastructure/interfaces/IRefreshToken';
import IJwt from '../infrastructure/interfaces/IJwt';
import IProjectRepository from '../infrastructure/interfaces/IProjectRepository';
import ITeamRepository from '../infrastructure/interfaces/ITeamRepository';

@injectable()
export default class TaskInteractor implements ITaskInteractor {
  private repository: ITaskRepository;
  private teamRepo: ITeamRepository;
  private projectRepo: IProjectRepository;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.TaskRepository) taskRepo: ITaskRepository,
    @inject(INTERFACE_TYPES.TeamRepository) teamRepo: ITeamRepository,
    @inject(INTERFACE_TYPES.ProjectRepository) projectRepo: IProjectRepository,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
  ) {
    this.repository = taskRepo;
    this.teamRepo = teamRepo;
    this.projectRepo = projectRepo;
    this.jwt = jwt;
  }

 
  async createTask(data: Partial<ITask>): Promise<ITask> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  

  async getTasksByTeam(teamId: string,projectId:string): Promise<ITask[] | null> {
    try {
      return await this.repository.findByTeamId(teamId,projectId);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  async getTaskByProjectId(projectId: string,teamId:string): Promise<ITask[] | null> {
    try {
      return await this.repository.findByProjectId(projectId,teamId);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }

  async getTeamIdByUserId(userId: string): Promise<any> {
    try {
      return await this.teamRepo.getTeamIdByUserId(userId);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  async getProjectsByTeamId(teamId: string): Promise<any> {
    try {
      return await this.projectRepo.getProjectsByTeamId(teamId);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  async addComment(taskId: string,data:any): Promise<any> {
    try {
      return await this.repository.addCommentByTaskId(taskId,data);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }













  async updateTaskStatus(taskId: string,status:string): Promise<ITask[] | null> {
    try {
      return await this.repository.updateTaskStatus(taskId,status);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }



  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken> {
    throw new Error('Method not implemented.');
  }

  execute(refreshToken: string): Promise<string> {
    throw new Error('Method not implemented.');
  }



  async updateTask(id: string,data:Partial<ITask>): Promise<any> {
    try {
      console.log('0000000000000000000000000')
      return await this.repository.update(id,data);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }

 async deleteTask(id: string): Promise<any> {
    try {
      return  await this.repository.delete(id);
   } catch (error) {
     console.error('Error finding tasks by project code:', error);
     throw error;
   }
  }
}
