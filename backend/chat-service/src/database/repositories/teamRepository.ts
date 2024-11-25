import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { ObjectId } from 'mongodb';
import IProject from '../../infrastructure/interfaces/IProject';
import ITeamRepository from '../../infrastructure/interfaces/ITeamRepository';
import ITeam from '../../infrastructure/interfaces/ITeam';
import { TeamModel } from '../model/teamModel';

@injectable()
export default class TeamRepository implements ITeamRepository {
  private readonly db: Model<ITeam>;

  constructor() {
    this.db = TeamModel;
  }

  async create(data: ITeam) {
    return await this.db.create(data);
  }

  async findByOrganization(organization:string) {
    return await this.db.find({organization});
  }

  async update(id: string, data: Partial<ITeam>) {
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
