import IChat from "./IChat"
import ITeam from "./ITeam"


export interface IChatInteractor {
  getTeamsByEmployee(employee: string, organization: string):Promise<Partial<ITeam>[]>
  getChats():Promise<Partial<IChat>[]>

  // // Optionally, list all chat users
  // getAllUsers(): Promise<IUser[]>;
}
