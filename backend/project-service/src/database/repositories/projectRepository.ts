import { ProjectModel } from '../model/projectModel';
import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { ObjectId } from 'mongodb';
import IProject from '../../infrastructure/interfaces/IProject';
import IProjectRepository from '../../infrastructure/interfaces/IProjectRepository';
import ITeam from '../../infrastructure/interfaces/ITeam';

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
  async findByProjectCode(projectCode:string) {
    return await this.db.find({projectCode});
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

 async findTeamByProjectCode(projectCode: string): Promise<any> {
    const project = await ProjectModel.findOne({ projectCode })
      .populate("teamId") // Populates the referenced Team
      .exec();

      console.log(project ,"fasluuuu")

    // Check if the project exists and return the team details
    if (project && project.teamId) {
      return project.teamId as unknown as ITeam; // Cast the populated teamId to ITeam
    }

    return null; // Return null if no project or team found
  }
}
