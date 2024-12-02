import mongoose from "mongoose";
import IUser from "../../infrastructure/interfaces/IUser";



const chatUserSchema = new mongoose.Schema<IUser>({
  userName: { type: String,},
  socketId: { type: String},
});


export const chatUserModel= mongoose.model<IUser>('CHAT_USER',chatUserSchema)
