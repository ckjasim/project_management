import { Document, Types } from "mongoose";

export default interface IChat extends Document {
  content: string,
  id: { type: string, unique: true },
  recipientId: string,
  roomId: string,
  senderId: string,
  senderName: string,
  timestamp: Date,
  type: { 
    type: string, 
    enum: ['group', 'private'] 
  }
}
