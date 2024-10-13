import IOtp from './IOtp';
import IUser from './IUser';

export interface IUserInteractor {
  createUser(data: Partial<IUser>): Promise<IUser>; 
  findUserByEmail(email: string): Promise<IUser | null>;
  comparePassword(password:string,hashPassword:string):Promise<boolean>; 
  saveOtp(data:Partial<IOtp>):Promise<IOtp>; 
  getOtp(email:string):Promise<IOtp>
  compareOtp(otp:string,hashOtp:string):Promise<boolean>; 

}
