import { IMeeting } from './IMeeting';


export interface IInteractor {
  createMeeting(data: Partial<IMeeting>): Promise<IMeeting>; 
  getTeamIdByUserId(userId: string): Promise<any>;  
  deleteMeetingById(meetingId: string): Promise<any>;  
  getMeetingsByTeamId(teamId: string): Promise<IMeeting[] | null>; 
  getMeetingsByOrganizer(organizer: string): Promise<IMeeting[] | null>; 
}