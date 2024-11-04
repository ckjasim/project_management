import ITask from '../../infrastructure/interfaces/ITask';
import ITaskRepository from '../../infrastructure/interfaces/ITaskRepository';
import { TaskModel } from '../model/taskModel';
import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { ObjectId } from 'mongodb'

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

  async updateTaskStatus(taskId: string, status: string) {
    const objectId = new ObjectId(taskId);
    console.log(objectId,'llllllllllllllll')
    
    return await this.db.findByIdAndUpdate(
      { _id: objectId }, 
      { $set: { status } },
      { new: true }
    );
  }
  
  
  
  async update(id: string, data: Partial<ITask>) {
    return await this.db.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await this.db.findByIdAndDelete(id);
  }


}
