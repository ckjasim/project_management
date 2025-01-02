
import { MeetingModel } from '../model/meetingModel';
import { Model } from 'mongoose';
import { injectable } from 'inversify';
import { ObjectId } from 'mongodb'
import IMeetingRepository from '../../infrastructure/interfaces/IMeetingRepository';
import { IMeeting } from '../../infrastructure/interfaces/IMeeting';

@injectable()
export default class MeetingRepository implements IMeetingRepository {
  private readonly db: Model<IMeeting>;

  constructor() {
    this.db = MeetingModel;
  }
 async findByOrganizer(organizer: string): Promise<IMeeting[] | null> {
    const res= await this.db.find({ organizer }).populate('teams')
    console.log(res)
return res
  }
  
  getMeetingsByOrganizer(organizer: string): Promise<IMeeting[] | null> {
    throw new Error('Method not implemented.');
  }
 

  async create(data: IMeeting) {
    return await this.db.create(data);
  }
  async findByTeamId(team: string) {
    const res= await this.db.find({ teams:team }).populate('teams');
    console.log(res)
return res
  }
  async deleteById(id: string) {
    const objectId = new ObjectId(id)
    return await this.db.findByIdAndDelete(id)
  }
//   async findByorganizer(organizer: string) {
//     const res= await this.db.find({ organizer })
//     console.log(res)
// return res
//   }

  



  
  async findByProjectId(projectId: string,teamId:string) {
    return await this.db.find({ project:projectId ,team:teamId}).populate('assignedTo');
  }

  async findById(id: string) {
    return await this.db.findById(id);
  }

  async updateTaskStatus(taskId: string, status: string) {
    const objectId = new ObjectId(taskId);
   
    
    return await this.db.findByIdAndUpdate(
      { _id: objectId }, 
      { $set: { status } },
      { new: true }
    );
  }
  
  
  
  // async update(id: string, data: Partial<ITask>) {
  //   try {
  //     const updatedTask = await TaskModel.findByIdAndUpdate(id, data, { new: true });
  //     return updatedTask;
  //   } catch (error) {
  //     console.error("Error updating task:", error);
  //   }
  // }

  async delete(id: string) {
    const objectId = new ObjectId(id);
    return await this.db.findByIdAndDelete(id);
  }


}
