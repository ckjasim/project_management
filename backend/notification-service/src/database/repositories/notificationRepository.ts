import { injectable } from 'inversify';
import { Model } from 'mongoose';

import IChatRepository from '../../infrastructure/interfaces/INotificationRepository';
import IChat from '../../infrastructure/interfaces/IChat';
import { ChatModel } from '../model/chatModel';
import INotificationRepository from '../../infrastructure/interfaces/INotificationRepository';
import { NotificationModel } from '../model/notificationModel';

@injectable()
export default class NotificationRepository implements INotificationRepository {
  private readonly db: Model<any>;

  constructor() {
    this.db = NotificationModel;
  }
  async getChats(): Promise<Partial<IChat>[]> {
    const chats = await this.db.find();
    return chats
  }

  async findById(id:string) {
    const chats = await this.db.find({userId:id});
    return chats
  }
  async deleteById(id:string) {
    const chats = await this.db.deleteOne({_id:id});
    return chats
  }
}
