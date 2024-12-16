import IChat from "./IChat"
import ITeam from "./ITeam"


export interface INotificationInteractor {
  getNotification(id: string):Promise<any>
  getChats():Promise<Partial<IChat>[]>

  // // Optionally, list all chat users
  // getAllUsers(): Promise<IUser[]>;
}
