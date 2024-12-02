import ITeam from './ITeam';

export default interface ITeamRepository {
  create(data: Partial<ITeam>): Promise<ITeam>;
  findByprojectManager(projectManager:string,organization:string): Promise<ITeam[] | null>;
  update(id: string, data: Partial<ITeam>): Promise<any>;
  delete(id: string): Promise<ITeam | null>;
}
