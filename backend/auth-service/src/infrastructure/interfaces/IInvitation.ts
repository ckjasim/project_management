import { Document, Types } from "mongoose";

export default interface IInvitation extends Document {
  name:string
  email: string;
  organization: Types.ObjectId;
  invitedBy: Types.ObjectId;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  jobRole: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
