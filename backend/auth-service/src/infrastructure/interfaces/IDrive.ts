import { Document, Types } from "mongoose";

export default interface IDrive extends Document {
  email: string;  
  accessToken: string; 
  refreshToken: string;  
  organization: string;  
  
}
