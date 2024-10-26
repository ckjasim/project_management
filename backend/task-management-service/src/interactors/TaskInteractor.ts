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

  addTask(data: { projectCode: any; topic: any; summary: any; description: any; dueDate: any; status: any; }): unknown {
    throw new Error('Method not implemented.');
  }

  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken> {
    throw new Error('Method not implemented.');
  }

  execute(refreshToken: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  createTask(data: Partial<ITask>): Promise<ITask> {
    throw new Error('Method not implemented.');
  }

  findTaskByProject(projectCode: string): Promise<ITask | null> {
    throw new Error('Method not implemented.');
  }

  changeStatus(projectCode: string): Promise<ITask | null> {
    throw new Error('Method not implemented.');
  }
}
