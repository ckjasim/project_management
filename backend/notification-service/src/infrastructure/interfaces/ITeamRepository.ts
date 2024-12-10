
import ITeam from './ITeam';


export default interface ITeamRepository {

  findByEmployee(employee: string, organization: string): Promise<Partial<ITeam>[]>;
 
}
