import { Document, Types } from "mongoose";

export default interface IProject extends Document {
  title: string;
  priority: string;
  description?: string;
  organization: Types.ObjectId;
  teams: {
    team: Types.ObjectId;
  }[];
  projectManager: Types.ObjectId;
  startDate?: Date;
  dueDate: Date;
  eventHistory?: Record<string, any>;
  status?: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  createdAt?: Date;
  updatedAt?: Date;
}
