import mongoose, { Model } from 'mongoose';
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

  async findByprojectManager(projectManager:string,organization:string) {
    return await this.db.find({projectManager,organization})
  }
  async findTeamByTeamId(teamId:string) {
    console.log(teamId)
    const id =new mongoose.Types.ObjectId(teamId)
    const team = await this.db.findOne({_id:id}).populate('members')
    console.log(team)
    return team
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

  async updateTeamMembers(id: string, data: any) {
    try {
      const updatedProject = await this.db.findByIdAndUpdate(
        id, 
        { $addToSet: { members: { $each: data } } }, 
        { new: true } 
      ).populate('members');
      return updatedProject;
    } catch (error) {
      console.error('Error updating team members:', error);
      throw error; 
    }
  }
  
  

  async delete(id: string) {
    return await this.db.findByIdAndDelete(id);
  }
}
