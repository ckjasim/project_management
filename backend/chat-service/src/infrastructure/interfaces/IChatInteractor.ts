import IProject from './IProject';
import ITeam from './ITeam';

export interface IChatInteractor {
  createProject(data: Partial<IProject>): Promise<IProject>;
  getProjectsByUserEmail(email:string): Promise<IProject[] | null>;
  updateProject(id: string, data: Partial<IProject>): Promise<void>;
  deleteProject(id: string): Promise<void>;
  
  createTeam(data:Partial<ITeam>):  Promise<ITeam>;
  getTeamsByOrganization(organization:string): Promise<ITeam[] | null>;
}
