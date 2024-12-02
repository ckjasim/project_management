import { injectable } from "inversify";
import { Model } from "mongoose";
import { chatUserModel } from "../model/chatUserModel";
import IUser from "../../infrastructure/interfaces/IUser";
import IChatUserRepository from "../../infrastructure/interfaces/IChatUserRepository";

@injectable()
export default class ChatUserRepository implements IChatUserRepository {
  private readonly db: Model<IUser>;

  constructor() {
    // Initialize the chatUserModel to interact with the database for chat-related operations
    this.db = chatUserModel;
  }

  // Find a chat user by their socketId
  async findBySocketId(socketId: string): Promise<IUser | null> {
    return await this.db.findOne({ socketId });
  }

  // Find a chat user by their userName (could be used to identify users in chat)
  async findByUserName(userName: string): Promise<IUser | null> {
console.log('9999999999999999',userName)

    const user =  await this.db.findOne({ userName });
    console.log('99999999999999',user)
    return user
  }
  async updateSocketId(userName: string, socketId: string): Promise<IUser | null> {
    try {
      return await this.db.findOneAndUpdate(
        { userName },          
        { $set: { socketId } }, 
        { new: true }          
      );
    } catch (error) {
      console.error(`Error updating socketId for user ${userName}:`, error);
      return null;
    }
  }
  

  // Create a new chat user (for registering user with socketId)
  async create(data: Partial<IUser>): Promise<IUser> {
    return await this.db.create(data);
  }

  // Delete a chat user (for when they disconnect or unregister)
  async deleteBySocketId(socketId: string): Promise<void> {
    await this.db.deleteOne({ socketId });
  }

  // Optionally, you might want to list all the chat users
  async findAll(): Promise<IUser[]> {
    return await this.db.find();
  }
}
