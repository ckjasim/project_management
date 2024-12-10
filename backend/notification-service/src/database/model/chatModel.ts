import mongoose, { Schema, Document, ObjectId } from "mongoose";

import IChat from "../../infrastructure/interfaces/IChat";



const chatSchema = new Schema<IChat>({
  content: String,
  id: { type: String, unique: true },
  recipientId: String,
  roomId: String,
  senderId: String,
  senderName: String,
  timestamp: Date,
  type: { 
    type: String, 
    enum: ['group', 'private'] 
  }
})
export const ChatModel = mongoose.model('Chat', chatSchema);
