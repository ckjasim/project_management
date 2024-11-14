import IEmployee from './IEmployee';
import IOtp from './IOtp';
import IRefreshToken from './IRefreshToken';

export interface IEmployeeInteractor {
  createUser(data: Partial<IEmployee>): Promise<IEmployee>; 
  findUserByEmail(email: string): Promise<IEmployee | null>;
  comparePassword(password:string,hashPassword:string):Promise<boolean>; 
  saveOtp(data:Partial<IOtp>):Promise<IOtp>; 
  getOtp(email:string):Promise<IOtp>
  compareOtp(otp:string,hashOtp:string):Promise<boolean>; 
  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 
  
  getEmployee(organization: string): Promise<IEmployee>;
  execute(refreshToken: string): Promise<string>
}
     