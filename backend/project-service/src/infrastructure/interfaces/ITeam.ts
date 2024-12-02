import { Document, Types } from "mongoose";

export default interface ITeam extends Document {
  name: string;
  organization: Types.ObjectId;
  projectManager: Types.ObjectId;
  members: Types.ObjectId[];
  eventHistory?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
