import IRefreshToken from './IRefreshToken';
import ITask from './ITask';

export interface ITaskInteractor {
  createTask(data: Partial<ITask>): Promise<ITask>; 
  getTaskByProjectCode(projectCode: string): Promise<ITask[] | null>; 
  updateTaskStatus(taskId: any, status: any): unknown;
  updateTask(id: string,data: Partial<ITask>): Promise<void >;
  deleteTask(id: string): Promise<void>;

  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 
  execute(refreshToken: string): Promise<string>;
}
