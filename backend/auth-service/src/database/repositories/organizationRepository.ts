
import { Model } from "mongoose";
import { injectable } from "inversify";
import IOrganization from "../../infrastructure/interfaces/IOrganization";
import { OrganizationModel } from "../model/organizationModel";
import IOrganizationRepository from "../../infrastructure/interfaces/IOrganizationRepository";

@injectable()
export default class organizationRepository implements IOrganizationRepository{
  private readonly db:Model<IOrganization>
constructor(){
  this.db=OrganizationModel
}

async findByEmail(email:String){
  return await this.db.findOne({email})
}
async findById(id:String){
  console.log(id)
  const resp=await this.db.findOne({_id:id})
  console.log(resp,'kkkkkkkkkkkkkkkkkkfdddddddddddddddddd')
  return resp
}
async findOneAndUpdate(email:String){
  const today = new Date();
  const nextYearDate = new Date();
  nextYearDate.setFullYear(today.getFullYear() + 1);
  return await this.db.findOneAndUpdate(
    { email },
    {
      $set: {
        subscriptionTier: 'premium',
        'billingInfo.renewalDate': nextYearDate,
      },
    },
    { new: true } 
  );
}
async create(data:Partial<IOrganization>){
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