


export default interface ITeamRepository {

  getTeamIdByUserId(userId: string): Promise<any>;

}
