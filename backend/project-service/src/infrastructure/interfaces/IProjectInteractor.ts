import IProject from './IProject';
import ITeam from './ITeam';

export interface IProjectInteractor {
  createProject(data: Partial<IProject>): Promise<IProject>;
  getProjectsByProjectManager(_id:string,organization:string): Promise<IProject[] | null>;
  getProjectsByProjectCode(projectCode:string): Promise<IProject[] | null>;
  updateProject(id: string, data: Partial<IProject>): Promise<void>;
  deleteProject(id: string): Promise<void>;
  
  createTeam(data:Partial<ITeam>):  Promise<ITeam>;
  getTeamMembersByProjectCode(projectCode:string):  Promise<ITeam[] | null>;
  getTeamsByprojectManager(projectManager:string,organization:string): Promise<ITeam[] | null>;
}
