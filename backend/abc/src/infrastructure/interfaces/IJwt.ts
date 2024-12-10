import { JwtPayload } from "jsonwebtoken";


export default interface IJwt{
  verifyToken(token:string):Promise<JwtPayload>
  verifyRefreshToken(token:string):Promise<JwtPayload>
}