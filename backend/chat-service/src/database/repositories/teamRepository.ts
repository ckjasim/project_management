import { Model } from 'mongoose';
import { injectable } from 'inversify';

import ITeamRepository from '../../infrastructure/interfaces/ITeamRepository';
import ITeam from '../../infrastructure/interfaces/ITeam';
import { TeamModel } from '../model/teamModel';
import mongoose from 'mongoose';

@injectable()
export default class TeamRepository implements ITeamRepository {
  private readonly db: Model<ITeam>;

  constructor() {
    this.db = TeamModel;
  }

  async findByEmployee(
    employee: string,
    organization: string
  ): Promise<Partial<ITeam>[]> {
    console.log(employee, 'sdfdfdfdfdfdf');
    const res = await this.db.find({
      organization: new mongoose.Types.ObjectId(organization),
      members: new mongoose.Types.ObjectId(employee),
    });
    return res;
  }
}
