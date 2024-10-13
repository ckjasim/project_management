import IUser from './IUser';

export default interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(data: IUser): Promise<IUser>;
  find():Promise<IUser[]>
  block(email: string): Promise<IUser | null> ;
  unBlock(email: string): Promise<IUser|null>;
}
