import ITeam from './ITeam';

export default interface ITeamRepository {
  create(data: Partial<ITeam>): Promise<ITeam>;
  findByprojectManager(projectManager:string,organization:string): Promise<ITeam[] | null>;
  findTeamByTeamId(teamId:string): Promise<any>;
  update(id: string, data: Partial<ITeam>): Promise<any>;
  updateTeamMembers(id: string, data: Partial<ITeam>): Promise<any>;
  delete(id: string): Promise<ITeam | null>;
}
