
import { Document } from "mongoose";

export default interface IRefreshToken extends Document {
  email: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
    
}
