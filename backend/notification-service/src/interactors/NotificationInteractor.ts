// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IChatUserRepository from '../infrastructure/interfaces/INotificationRepository';
import IUser from '../infrastructure/interfaces/IUser';
import ChatUserRepository from '../database/repositories/notificationRepository';
import ITeamRepository from '../infrastructure/interfaces/ITeamRepository';
import {  INotificationInteractor } from '../infrastructure/interfaces/INotificationInteractor';
import IChatRepository from '../infrastructure/interfaces/INotificationRepository';
import INotificationRepository from '../infrastructure/interfaces/INotificationRepository';
import IChat from '../infrastructure/interfaces/IChat';

@injectable()
export default class NotificationInteractor implements INotificationInteractor {
  private teamRepository: ITeamRepository;
  private notificationRepository: INotificationRepository;

  constructor(
    @inject(INTERFACE_TYPES.TeamRepository) teamRepo: ITeamRepository,

    @inject(INTERFACE_TYPES.NotificationRepository) notRepo: INotificationRepository
  ) {
    this.teamRepository = teamRepo;
    this.notificationRepository = notRepo;
  }
  getChats(): Promise<Partial<IChat>[]> {
    throw new Error('Method not implemented.');
  }

  async getNotification(id: string) {
    return await this.notificationRepository.findById(id);
  }
  async deleteNotification(id: string) {
    return await this.notificationRepository.deleteById(id);
  }

}
