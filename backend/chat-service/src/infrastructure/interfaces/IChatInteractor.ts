import IUser from './IUser';

export interface IChatInteractor {
  // Create a new chat user
  createUser(data: Partial<IUser>): Promise<IUser>;
  updateSocketId(userName:string,socketId:string): Promise<IUser>;

  // Get a chat user by their socket ID
  getUserBySocketId(socketId: string): Promise<IUser | null>;

  // Get a chat user by their user name
  getUserByUserName(userName: string): Promise<IUser | null>;

  // Delete a chat user by socket ID
  deleteUserBySocketId(socketId: string): Promise<void>;

  // // Optionally, list all chat users
  // getAllUsers(): Promise<IUser[]>;
}
