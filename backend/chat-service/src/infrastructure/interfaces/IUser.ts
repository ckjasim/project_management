import { Document, Types } from "mongoose";

export default interface IUser extends Document {
  name: string;  
  email: string; 
  password: string;  
  role: 'admin' | 'project manager' | 'employee'; 
  organization: Types.ObjectId;
  isBlock?: boolean;
  lastLogin?: Date; 
  createdAt?: Date;
  updatedAt?: Date; 
}
