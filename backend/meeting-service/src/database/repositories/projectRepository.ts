

import { Model } from 'mongoose';
import { injectable } from 'inversify';

import ITeam from '../../infrastructure/interfaces/IMeeting';
import ITeamRepository from '../../infrastructure/interfaces/ITeamRepository';
import { TeamModel } from '../model/teamModel';
import IProject from '../../infrastructure/interfaces/IProject';
import { ProjectModel } from '../model/projectModel';
import IProjectRepository from '../../infrastructure/interfaces/IProjectRepository';

@injectable()
export default class ProjectRepository implements IProjectRepository {
  private readonly db: Model<IProject>;

  constructor() {
    this.db = ProjectModel;
  }
  async getProjectsByTeamId(teamId: string): Promise<any> {
    try {
      const projects = await ProjectModel.find({ 
        teams: teamId // Matches if `teamId` is in the `teams` array
      });
  
      console.log('Projects:', projects);
      return projects; // Returns an array of projects
    } catch (error) {
      console.error('Error finding projects by team ID:', error);
      throw error;
    }
  }
  
 



}
