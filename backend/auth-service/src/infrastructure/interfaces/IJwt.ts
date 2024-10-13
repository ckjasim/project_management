import { JwtPayload } from "jsonwebtoken";


export default interface IJwt{
  generateToken(id:string):string;
  verifyToken(token:string):Promise<JwtPayload>
}