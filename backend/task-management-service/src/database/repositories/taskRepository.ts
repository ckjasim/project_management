import ITask from '../../infrastructure/interfaces/ITask';
import ITaskRepository from '../../infrastructure/interfaces/ITaskRepository';
import { TaskModel } from '../model/taskModel';
import { Model } from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export default class TaskRepository implements ITaskRepository {
  private readonly db: Model<ITask>;

  constructor() {
    this.db = TaskModel;
  }

  async create(data: ITask) {
    return await this.db.create(data);
  }

  async findByProjectId(projectId: string) {
    return await this.db.find({ projectId });
  }
  async findByProjectCode(projectCode: string) {
    return await this.db.find({ projectCode });
  }

  async findById(id: string) {
    return await this.db.findById(id);
  }

  async update(id: string, data: Partial<ITask>) {
    return await this.db.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await this.db.findByIdAndDelete(id);
  }

  async changeStatus(id: string, status: string) {
    return await this.db.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
  }
}
