import { config } from 'dotenv';
import { injectable } from 'inversify';
import IJwt from '../interfaces/IJwt';
import jwt, { JwtPayload } from 'jsonwebtoken';

config();

@injectable()
export default class Jwt implements IJwt {
  private readonly secret: string;
  constructor() {
    this.secret = process.env.JWT_SECRET || '';
  }
  generateToken(id: string): string {
    return jwt.sign({ id }, this.secret, {
      expiresIn: '30h',
    });
  }
  async verifyToken(token: string): Promise<JwtPayload> {
    const secret = new TextEncoder().encode(this.secret) as any;
    return (await jwt.verify(token, secret)) as JwtPayload;
  }
}
