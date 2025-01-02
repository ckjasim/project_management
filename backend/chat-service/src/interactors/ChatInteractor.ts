// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IChatUserRepository from '../infrastructure/interfaces/IChatRepository';
import IUser from '../infrastructure/interfaces/IUser';
import ChatUserRepository from '../database/repositories/chatRepository';
import ITeamRepository from '../infrastructure/interfaces/ITeamRepository';
import { IChatInteractor } from '../infrastructure/interfaces/IChatInteractor';
import IChatRepository from '../infrastructure/interfaces/IChatRepository';

@injectable()
export default class ChatInteractor implements IChatInteractor {
  private teamRepository: ITeamRepository;
  private chatRepository: IChatRepository;

  constructor(
    @inject(INTERFACE_TYPES.TeamRepository) teamRepo: ITeamRepository,
    @inject(INTERFACE_TYPES.ChatRepository) chatRepo: IChatRepository
  ) {
    this.teamRepository = teamRepo;
    this.chatRepository = chatRepo;
  }

  async getTeamsByEmployee(employee: string, organization: string) {
    return await this.teamRepository.findByEmployee(employee, organization);
  }
  async getChats() {
    return await this.chatRepository.getChats();
  }
  async markRead(ids:any) {
    return await this.chatRepository.markRead(ids);
  }
}
