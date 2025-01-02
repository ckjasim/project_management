import IProject from './IProject';
import IRefreshToken from './IRefreshToken';
import ITask from './ITask';

export interface ITaskInteractor {
  createTask(data: Partial<ITask>): Promise<ITask>; 
  getTasksByTeam(teamId: string,projectId:string): Promise<ITask[] | null>; 
  getTaskByProjectId(projectId: string,teamId:string): Promise<ITask[] | null>; 
  addComment(taskId: string,payload:any): Promise<ITask[] | null>; 

  getTeamIdByUserId(userId: string): Promise<any>; 
  getProjectsByTeamId(teamId: string): Promise<IProject[]>; 



  
  updateTaskStatus(taskId: any, status: any): unknown;
  updateTask(id: string,data: Partial<ITask>): Promise<void >;
  deleteTask(id: string): Promise<void>;

  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 
  execute(refreshToken: string): Promise<string>;
}
