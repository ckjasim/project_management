
import IUser from './IUser';

export default interface IChatUserRepository {
  findBySocketId(socketId: string): Promise<IUser | null>;
  findByUserName(userName:string): Promise<IUser | null>;
  create( data: Partial<IUser>): Promise<IUser>;
  deleteBySocketId(socketId: string): Promise<void>;
  updateSocketId(userName:string,socketId:string):Promise<IUser | null>

  findAll(): Promise<IUser[] | null>;
}
