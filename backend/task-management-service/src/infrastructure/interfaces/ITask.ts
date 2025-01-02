import { Document, ObjectId } from "mongoose";

export default interface ITask extends Document {
  project: ObjectId; 
  team: ObjectId; 
  title: string; 
  description?: string;
  assignedTo?: ObjectId; 
  status?: 'pending' | 'progressing' | 'review' | 'completed'; 
  priority?: 'low' | 'medium' | 'high' | 'critical'; 
  attachments:any
  comments?:any
  dueDate: Date; 
  createdAt?: Date;
  updatedAt?: Date; 
}
