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
async blockOrUnblock(email: string) {
  const result = await this.db.findOneAndUpdate(
    { email }, 
    [
      {
        $set: {
          isBlock: { $eq: ["$isBlock", false] }, 
        },
      },
    ],
    { returnDocument: 'after' } 
  );
console.log(result)
  if (result) {
    return { _id:result._id, isBlock: result.isBlock };
  } else {
    throw new Error(`User with email ${email} not found`);
  }
}

}