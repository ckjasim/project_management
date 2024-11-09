import { Document, ObjectId } from "mongoose";
export default interface ITeam extends Document {
  _id:ObjectId,
  teamName: string;
  members: ObjectId[];
  eventHistory: Record<string, any>;
  createdAt?: Date;
  organization:string;
  updatedAt?: Date;


}