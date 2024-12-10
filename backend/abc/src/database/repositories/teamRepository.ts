

import { Model } from 'mongoose';
import { injectable } from 'inversify';

import ITeam from '../../infrastructure/interfaces/ITeam';
import ITeamRepository from '../../infrastructure/interfaces/ITeamRepository';
import { TeamModel } from '../model/teamModel';

@injectable()
export default class TeamRepository implements ITeamRepository {
  private readonly db: Model<ITeam>;

  constructor() {
    this.db = TeamModel;
  }
  async getTeamIdByUserId(userId: string): Promise<any> {
    try {
      const team = await this.db.findOne({ 
        members: userId
      }).select('_id'); 
      return team ? team._id : null;
    } catch (error) {
      console.error('Error finding team by user ID:', error);
      throw error;
    }
  }
  
 



}
