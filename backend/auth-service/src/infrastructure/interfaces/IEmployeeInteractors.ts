import IEmployee from './IEmployee';
import IOtp from './IOtp';

export interface IEmployeeInteractor {
  createUser(data: Partial<IEmployee>): Promise<IEmployee>; 
  findUserByEmail(email: string): Promise<IEmployee | null>;
  comparePassword(password:string,hashPassword:string):Promise<boolean>; 
  saveOtp(data:Partial<IOtp>):Promise<IOtp>; 
  getOtp(email:string):Promise<IOtp>
  compareOtp(otp:string,hashOtp:string):Promise<boolean>; 

}
