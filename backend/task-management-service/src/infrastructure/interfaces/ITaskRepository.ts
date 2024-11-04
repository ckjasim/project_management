import ITask from "./ITask";

export default interface ITaskRepository {
  
  create(data: Partial<ITask>): Promise<ITask>;
  // findByProjectId(projectId: string): Promise<ITask[]>;
  findByProjectCode(projectCode: string): Promise<ITask[] |null>;
  updateTaskStatus(taskId: string,status:string): Promise<any>;
  findById(id: string): Promise<ITask | null>;
  update(id: string, data: Partial<ITask>): Promise<ITask | null>;
  delete(id: string): Promise<ITask | null>;
}
