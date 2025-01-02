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
  },
  isImage:{type:Boolean,default:false },
  isRead:{type:Boolean,default:false }
})
export const ChatModel = mongoose.model('Chat', chatSchema);
