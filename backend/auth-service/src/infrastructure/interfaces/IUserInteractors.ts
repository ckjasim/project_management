import IOtp from './IOtp';
import IRefreshToken from './IRefreshToken';
import IUser from './IUser';

export interface IUserInteractor {
  createUser(data: Partial<IUser>): Promise<IUser>; 
  createRefreshToken(data: Partial<IRefreshToken>): Promise<IRefreshToken>; 
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  comparePassword(password:string,hashPassword:string):Promise<boolean>; 
  saveOtp(data:Partial<IOtp>):Promise<IOtp>; 
  getOtp(email:string):Promise<IOtp>
  compareOtp(otp:string,hashOtp:string):Promise<boolean>; 
  execute(refreshToken: string): Promise<string>

}
