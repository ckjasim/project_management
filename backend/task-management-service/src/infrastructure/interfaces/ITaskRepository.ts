import { UpdateWriteOpResult } from 'mongoose';
import ITask from './ITask';

export default interface ITaskRepository {
  create(data: Partial<ITask>): Promise<ITask>;
  findByTeamId(teamId: string,projectId:string): Promise<ITask[] | null>;
  findByProjectId(projectId: string,teamId:string): Promise<ITask[] | null>;
  addCommentByTaskId(taskId: string, payload: any): Promise<ITask | null>;




  updateTaskStatus(taskId: string, status: string): Promise<any>;

  update(id: string, data: Partial<ITask>): Promise<any>;
  delete(id: string): Promise<ITask | null>;
}
