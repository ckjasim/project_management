// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IChatUserRepository from '../infrastructure/interfaces/IChatUserRepository';
import IUser from '../infrastructure/interfaces/IUser';
import ChatUserRepository from '../database/repositories/chatUserRepository';

@injectable()
export default class ChatInteractor {
  private chatUserRepository: IChatUserRepository;

  constructor(
    @inject(INTERFACE_TYPES.ChatUserRepository) chatUserRepo: IChatUserRepository  
  ) {
    this.chatUserRepository = chatUserRepo;
  }

  // Find a chat user by their socket ID
  async getUserBySocketId(socketId: string): Promise<IUser | null> {
    try {
      return await this.chatUserRepository.findBySocketId(socketId);
    } catch (error) {
      console.error('Error finding user by socketId:', error);
      throw error;
    }
  }

  // Find a chat user by their userName
  async getUserByUserName(userName: string): Promise<IUser | null> {
    try {
      return await this.chatUserRepository.findByUserName(userName);
    } catch (error) {
      console.error('Error finding user by userName:', error);
      throw error;
    }
  }

  // Create a new chat user
  async createUser(data: Partial<IUser>): Promise<IUser> {
    try {
      return await this.chatUserRepository.create(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Delete a chat user by socket ID
  async deleteUserBySocketId(socketId: string): Promise<void> {
    try {
      await this.chatUserRepository.deleteBySocketId(socketId);
    } catch (error) {
      console.error('Error deleting user by socketId:', error);
      throw error;
    }
  }
  async updateSocketId(userName:string,socketId: string): Promise<any> {
    try {
      return await this.chatUserRepository.updateSocketId(userName,socketId);
    } catch (error) {
      console.error('Error deleting user by socketId:', error);
      throw error;
    }
  }

  // Optionally, you can add more user-related methods if needed, such as listing all users
  async getAllUsers(): Promise<IUser[] |null> {
    try {
      return await this.chatUserRepository.findAll();
    } catch (error) {
      console.error('Error retrieving all users:', error);
      throw error;
    }
  }
}
