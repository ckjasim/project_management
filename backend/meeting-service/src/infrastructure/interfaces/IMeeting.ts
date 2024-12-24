import { Document, ObjectId } from "mongoose";

export interface IMeeting extends Document {
  title: string;
  description?: string;
  teams: ObjectId[];
  organizer: ObjectId;
  // attendees: ObjectId[];
  date: Date;
  time: string;
  duration: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}