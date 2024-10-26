import IRefreshToken from './IRefreshToken';
import ITask from './ITask';

export interface ITaskInteractor {
  getTaskByProjectCode(projectCode: string): Promise<ITask[] | null>; 
  addTask(data: { projectCode: any; topic: any; summary: any; description: any; dueDate: any; status: any; }): unknown;
  createTask(data: Partial<ITask>): Promise<ITask>; 
  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 
  changeStatus(projectCode: string): Promise<ITask | null>;
  execute(refreshToken: string): Promise<string>;
}
