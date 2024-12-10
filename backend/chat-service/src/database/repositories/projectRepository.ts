import { ProjectModel } from '../model/projectModel';
import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { ObjectId } from 'mongodb';
import IProject from '../../infrastructure/interfaces/IProject';
import IProjectRepository from '../../infrastructure/interfaces/IChatRepository';

@injectable()
export default class ProjectRepository implements IProjectRepository {
  private readonly db: Model<IProject>;

  constructor() {
    this.db = ProjectModel;
  }

  async create(data: IProject) {
    return await this.db.create(data);
  }

  async findByUserEmail(userEmail:string) {
    return await this.db.find({userEmail});
  }

  async update(id: string, data: Partial<IProject>) {
    try {
      const updatedProject = await this.db.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updatedProject;
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async delete(id: string) {
    return await this.db.findByIdAndDelete(id);
  }
}
