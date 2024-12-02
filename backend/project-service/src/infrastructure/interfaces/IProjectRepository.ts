import IProject from './IProject';
import ITeam from './ITeam';

export default interface IProjectRepository {
  create(data: Partial<IProject>): Promise<IProject>;
  findByProjectManager(_id:string,organization:string): Promise<IProject[] | null>;
  findByProjectCode(projectCode:string): Promise<IProject[] | null>;
  findTeamByProjectCode(projectCode:string): Promise<ITeam[] | null>;
  update(id: string, data: Partial<IProject>): Promise<any>;
  delete(id: string): Promise<IProject | null>;
}
