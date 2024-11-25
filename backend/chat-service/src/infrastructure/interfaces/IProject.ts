import { Document, ObjectId } from "mongoose";
import { Types } from "mongoose";
export default interface IProject extends Document {
  userEmail:string
  title: string;
  projectCode: string;
  summary: string;
  description?: string;
  teamId: Types.ObjectId;
  dueDate: Date;
  isActive: boolean;
  eventHistory?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;


}