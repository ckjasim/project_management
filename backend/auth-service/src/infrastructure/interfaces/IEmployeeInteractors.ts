import { Types } from 'mongoose';
import IEmployee from './IEmployee';
import IOtp from './IOtp';
import IRefreshToken from './IRefreshToken';
import IInvitation from './IInvitation';

export interface IEmployeeInteractor {
  findInvitation(token: any): Promise<IInvitation | null>;
  findInvitationByEmail(email: string,organization:any): Promise<IInvitation | null>;
  createUser(data: Partial<IEmployee>): Promise<IEmployee>; 
  createInvitation(data: Partial<IInvitation>): Promise<IInvitation>; 
  findUserByEmail(email: string,organization:string): Promise<IEmployee | null>;
  findUserByEmailForLogin(email: string): Promise<IEmployee | null>;



  comparePassword(password:string,hashPassword:string):Promise<boolean>; 
  saveOtp(data:Partial<IOtp>):Promise<IOtp>; 
  getOtp(email:string):Promise<IOtp>
  compareOtp(otp:string,hashOtp:string):Promise<boolean>; 
  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 
  
  getEmployee(organization: string): Promise<IEmployee>;
  execute(refreshToken: string): Promise<string>
}
     