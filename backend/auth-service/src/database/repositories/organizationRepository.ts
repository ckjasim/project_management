
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
  return await this.db.findOne({id})
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