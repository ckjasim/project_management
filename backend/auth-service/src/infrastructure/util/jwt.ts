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
  }
  generateToken(data: object | string, expiresIn: string = '15m'): string {
    return jwt.sign(
      typeof data === 'string' ? { id: data } : data,
      this.secret,
      { expiresIn }
    );
  }
  generateRefreshToken(user: string) {
    return jwt.sign(user, this.refreshSecret, { expiresIn: '1d' });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return (await jwt.verify(token, this.secret)) as JwtPayload;
  }
  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return (await jwt.verify(token, this.refreshSecret)) as JwtPayload;
  }

}
