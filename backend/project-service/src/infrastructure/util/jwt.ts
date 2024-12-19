import { config } from 'dotenv';
import { injectable } from 'inversify';
import IJwt from '../interfaces/IJwt';
import jwt, { JwtPayload } from 'jsonwebtoken';

config();


@injectable()
export default class Jwt implements IJwt {
  private readonly secret: string;
  private readonly refreshSecret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || '';
    this.refreshSecret = process.env.REFRESH_TOKEN_SECRET || '';
    
    if (!this.secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (!this.refreshSecret) {
      throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return (await jwt.verify(token, this.secret)) as JwtPayload;
    } catch (error:any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      throw new Error('Invalid token');
    }
    }
  


  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return (await jwt.verify(token, this.refreshSecret)) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
