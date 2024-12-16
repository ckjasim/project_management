import IUser from "../../infrastructure/interfaces/IUser";
import IUserRepository from "../../infrastructure/interfaces/IUserRepository";
import { UserModel } from "../model/userModel";
import { Model } from "mongoose";
import { injectable } from "inversify";

@injectable()
export default class UserRepository implements IUserRepository{
  private readonly db:Model<IUser>
constructor(){
  this.db=UserModel
}

async findByEmail(email:String){
  return await this.db.findOne({email})
}
async findById(id:String){
  return await this.db.findOne({id})
}
async create(data:IUser){
  return await this.db.create(data)
}
async find(){
  return await this.db.find().populate('organization')
}
async getUser(organization:String){
  console.log('db')
  return await this.db.findOne({organization})
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