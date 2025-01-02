import ITask from '../../infrastructure/interfaces/ITask';
import ITaskRepository from '../../infrastructure/interfaces/ITaskRepository';
import { TaskModel } from '../model/taskModel';
import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { ObjectId } from 'mongodb';

@injectable()
export default class TaskRepository implements ITaskRepository {
  private readonly db: Model<ITask>;

  constructor() {
    this.db = TaskModel;
  }

  async create(data: ITask) {
    return await this.db.create(data);
  }
  async findByTeamId(team: string, projectId: string) {
    const res = await this.db
      .find({ team, project: projectId })
      .populate('assignedTo').populate('comments.author');
    console.log(res);
    return res;
  }
  async addCommentByTaskId(taskId: string, payload: any) {
    const res = await this.db.updateOne(
      { _id: taskId },
      { $push: { comments: payload } } 
    );
  
    const tasks = await this.db.findOne({ _id: taskId }).populate('comments.author');

  return tasks ? tasks : null;
  }
  
    async findByProjectId(projectId: string, teamId: string) {
      return await this.db
        .find({ project: projectId, team: teamId })
        .populate('assignedTo').populate('comments.author');
    }

  async findById(id: string) {
    return await this.db.findById(id);
  }

  async updateTaskStatus(taskId: string, status: string) {
    const objectId = new ObjectId(taskId);

    return await this.db.findByIdAndUpdate(
      { _id: objectId },
      { $set: { status } },
      { new: true }
    );
  }

  async update(id: string, data: Partial<ITask>) {
    try {
      const updatedTask = await TaskModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async delete(id: string) {
    const objectId = new ObjectId(id);
    const resp=await this.db.findByIdAndDelete({_id:id});
    console.log(resp,'kkkkkkkkkkkkkkk')
    return resp
  }
}
