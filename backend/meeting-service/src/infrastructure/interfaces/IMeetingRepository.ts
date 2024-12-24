import { IMeeting } from './IMeeting';

export default interface IMeetingRepository {
  create(data: Partial<IMeeting>): Promise<IMeeting>;
  findByTeamId(teamId: string): Promise<IMeeting[] | null>;
  findByOrganizer(organizer: string): Promise<IMeeting[] | null>;
  getMeetingsByOrganizer(organizer: string): Promise<IMeeting[] | null>;
  
}
