import IEmployee from './IEmployee';
import IRefreshToken from './IRefreshToken';
import IUser from './IUser';

export interface IAdminInteractor {
  getAllUsers(): Promise<IUser[] | null>; 
  getAllEmployees(): Promise<IEmployee[] | null>; 
  blockUser(id: string): Promise<IUser | null>;
  unBlockUser(id: string): Promise<IUser | null>;
  blockEmployee(id: string): Promise<IEmployee | null>;
  unBlockEmployee(id: string): Promise<IEmployee | null>;
  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 

}
