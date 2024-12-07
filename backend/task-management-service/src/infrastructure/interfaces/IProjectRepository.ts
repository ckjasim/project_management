


export default interface IProjectRepository {

  getProjectsByTeamId(teamId: string): Promise<any>;

}
