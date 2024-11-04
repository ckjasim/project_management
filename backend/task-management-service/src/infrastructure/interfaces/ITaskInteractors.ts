import IRefreshToken from './IRefreshToken';
import ITask from './ITask';

export interface ITaskInteractor {
  updateTaskStatus(taskId: any, status: any): unknown;
  getTaskByProjectCode(projectCode: string): Promise<ITask[] | null>; 

  createTask(data: Partial<ITask>): Promise<ITask>; 
  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 
  changeStatus(projectCode: string): Promise<ITask |null>;
  execute(refreshToken: string): Promise<string>;
}
