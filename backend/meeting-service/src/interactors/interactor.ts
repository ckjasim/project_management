// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import { IInteractor } from '../infrastructure/interfaces/IInteractors';
import IJwt from '../infrastructure/interfaces/IJwt';
import ITeamRepository from '../infrastructure/interfaces/ITeamRepository';
import { IMeeting } from '../infrastructure/interfaces/IMeeting';
import IMeetingRepository from '../infrastructure/interfaces/IMeetingRepository';

@injectable()
export default class Interactor implements IInteractor {
  private repository: IMeetingRepository;
  private teamRepo: ITeamRepository;

  private jwt: IJwt;

  constructor(
    
    @inject(INTERFACE_TYPES.TeamRepository) teamRepo: ITeamRepository,
    @inject(INTERFACE_TYPES.MeetingRepository) meetingRepo: IMeetingRepository,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
  ) {
    this.repository = meetingRepo;
    this.teamRepo = teamRepo;
    this.jwt = jwt;
  }

 
  async createMeeting(data: Partial<IMeeting>): Promise<IMeeting> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }

  async getMeetingsByTeamId(teamId: string): Promise<IMeeting[] | null> {
    try {
      return await this.repository.findByTeamId(teamId);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }

  async getMeetingsByOrganizer(organizer: string): Promise<IMeeting[] | null> {
    try {
      return await this.repository.findByOrganizer(organizer);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }

  async getTeamIdByUserId(userId: string): Promise<any> {
    try {
      return await this.teamRepo.getTeamIdByUserId(userId);
    } catch (error) {
      console.error('Error finding tasks by project code:', error);
      throw error;
    }
  }
 









 
}
