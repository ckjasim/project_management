import { Document, ObjectId } from "mongoose";
export default interface ITask extends Document {
  projectCode: string;
  topic: string;
  summary: string;
  description: string;
  photo?: Buffer;
  dueDate: Date;
  createdAt?: Date;
  status?: string;
}