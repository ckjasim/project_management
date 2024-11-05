import ITask from './ITask';

export default interface ITaskRepository {
  create(data: Partial<ITask>): Promise<ITask>;

  findByProjectCode(projectCode: string): Promise<ITask[] | null>;
  updateTaskStatus(taskId: string, status: string): Promise<any>;

  update(id: string, data: Partial<ITask>): Promise<any>;
  delete(id: string): Promise<ITask | null>;
}
