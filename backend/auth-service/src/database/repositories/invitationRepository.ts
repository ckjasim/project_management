import IUser from "../../infrastructure/interfaces/IUser";
import mongoose, { Model } from "mongoose";
import { injectable } from "inversify";
import IInvitationRepository from "../../infrastructure/interfaces/IInvitationRepository";
import IInvitation from "../../infrastructure/interfaces/IInvitation";
import { InvitationModel } from "../model/invitationModel";

@injectable()
export default class InvitationRepository implements IInvitationRepository{
  private readonly db:Model<IInvitation>
constructor(){
  this.db=InvitationModel
}

async findInvitaionByEmail(email:String,organization:any){
  console.log('jjjj')
  console.log(email)
  console.log(organization)
  try {
    const orgId = new mongoose.Types.ObjectId(organization);
    const res= await this.db.findOne({ email, organization:orgId });
    return res
  } catch (error) {
    console.error('Error finding employee:', error);
    throw new Error('Could not fetch employee');
  } 
}
async findByToken(token:any){
  return await this.db.findOne({token}).populate('organization')
}
async create(data:IInvitation){
  return await this.db.create(data)
}
async find(){
  return await this.db.find()
}
async blockOrUnblock(email:string){
  return await this.db.updateOne(
    { email },
    [
      { 
        $set: { 
          isBlock: { $eq: ["$isBlock", false] }
        } 
      }
    ]
  );
  

}
}