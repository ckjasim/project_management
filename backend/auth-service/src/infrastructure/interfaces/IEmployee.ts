import { Document, Types } from 'mongoose';

export default interface IEmployee extends Document {
  name: string;
  email: string;
  password: string;
  mobile: number; 
  role: string;
  isBlock?: boolean;
  jobRole: string;
  profileImage?: {
    public_id: string; 
    url: string;  
  };
  organization: Types.ObjectId;
}
