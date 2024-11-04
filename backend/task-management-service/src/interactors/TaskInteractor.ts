// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';
import ITaskRepository from '../infrastructure/interfaces/ITaskRepository';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import { ITaskInteractor } from '../infrastructure/interfaces/ITaskInteractors';
import ITask from '../infrastructure/interfaces/ITask';
import IRefreshToken from '../infrastructure/interfaces/IRefreshToken';
import IJwt from '../infrastructure/interfaces/IJwt';

@injectable()
export default class TaskInteractor implements ITaskInteractor {
  private repository: ITaskRepository;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.TaskRepository) taskRepo: ITaskRepository,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
  ) {
    this.repository = taskRepo;
    this.jwt = jwt;
  }
 

  async getTaskByProjectCode(projectCode: string): Promise<ITask[] | null> {
    try {
      return await this.repository.findByProjectCode(projectCode);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
  async updateTaskStatus(taskId: string,status:string): Promise<ITask[] | null> {
    try {
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
      return await this.repository.updateTaskStatus(taskId,status);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }

  async createTask(data: Partial<ITask>): Promise<ITask> {
    try {
      return await this.repository.create(data);
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



  findTaskByProject(projectCode: string): Promise<ITask | null> {
    throw new Error('Method not implemented.');
  }

  changeStatus(projectCode: string): Promise<ITask | null> {
    throw new Error('Method not implemented.');
  }
}
