import { JwtPayload } from "jsonwebtoken";


export default interface IJwt{
  generateToken(data:object | string , expiresIn?:string):string;
  generateRefreshToken(data:object | string , expiresIn?:string):string;
  verifyToken(token:string):Promise<JwtPayload>
  verifyRefreshToken(token:string):Promise<JwtPayload>
}