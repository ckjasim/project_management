import IEmployee from './IEmployee';
import IOrganization from './IOrganization';
import IRefreshToken from './IRefreshToken';
import IUser from './IUser';

export interface IAdminInteractor {
  manageEmployee(id: any): any;
  getAllUsers(): Promise<IUser[] | null>; 
  getAllOrganization(): Promise<IOrganization[] | null>; 
  getAllEmployees(): Promise<IEmployee[] | null>; 
 manageUser(id: string): Promise<IUser | null>;

  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 

}
