import IUser from "../../infrastructure/interfaces/IUser";
import IUserRepository from "../../infrastructure/interfaces/IUserRepository";
import { userModel } from "../model/userModel";
import { Model } from "mongoose";
import { injectable } from "inversify";

@injectable()
export default class UserRepository implements IUserRepository{
  private readonly db:Model<IUser>
constructor(){
  this.db=userModel
}

async findByEmail(email:String){
  return await this.db.findOne({email})
}
async create(data:IUser){
  return await this.db.create(data)
}
async find(){
  return await this.db.find()
}
async block(email:string){
  return await this.db.findOneAndUpdate({email},{$set:{isBlock:true}})
}
async unBlock(email:string){
  return await this.db.findOneAndUpdate({email},{$set:{isBlock:false}})

}
}