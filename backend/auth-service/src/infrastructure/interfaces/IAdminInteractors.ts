import IEmployee from './IEmployee';
import IRefreshToken from './IRefreshToken';
import IUser from './IUser';

export interface IAdminInteractor {
  manageEmployee(id: any): unknown;
  getAllUsers(): Promise<IUser[] | null>; 
  getAllEmployees(): Promise<IEmployee[] | null>; 
 manageUser(id: string): Promise<IUser | null>;

  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 

}
