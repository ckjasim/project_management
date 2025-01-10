import IUser from './IUser';

export default interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(data: IUser): Promise<IUser>;
  updatePassword(data: any): Promise<any>;
  find():Promise<IUser[]>
  blockOrUnblock(email: string): Promise<any> ;
  getUser(organization:string):Promise<any>
}
