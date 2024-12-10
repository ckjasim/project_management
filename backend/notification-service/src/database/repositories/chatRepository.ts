import { injectable } from 'inversify';
import { Model } from 'mongoose';

import IChatRepository from '../../infrastructure/interfaces/IChatRepository';
import IChat from '../../infrastructure/interfaces/IChat';
import { ChatModel } from '../model/chatModel';

@injectable()
export default class ChatRepository implements IChatRepository {
  private readonly db: Model<IChat>;

  constructor() {
    this.db = ChatModel;
  }
  async getChats(): Promise<Partial<IChat>[]> {
    const chats = await this.db.find();
    return chats
  }

  async create(data: IChat) {
    return await this.db.create(data);
  }
}