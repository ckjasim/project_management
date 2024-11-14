import IUser from "../../infrastructure/interfaces/IUser";
import IUserRepository from "../../infrastructure/interfaces/IUserRepository";
import { employeeModel } from "../model/employeeModel";
import { Model } from "mongoose";
import { injectable } from "inversify";
import IEmployeeRepository from "../../infrastructure/interfaces/IEmployeeRepository";
import IEmployee from "../../infrastructure/interfaces/IEmployee";

@injectable()
export default class EmployeeRepository implements IEmployeeRepository{
  private readonly db:Model<IEmployee>
constructor(){
  this.db=employeeModel
}

async findByEmail(email:String){
  return await this.db.findOne({email})
}
async getEmployee(organization:String){
  console.log('db')
  return await this.db.find({organization})
}
async create(data:IEmployee){
  return await this.db.create(data)
}
async find(){
  return await this.db.find()
}
async block(id:string){
  return await this.db.findOneAndUpdate({_id :id},{$set:{isBlock:true}})
}
async unBlock(id:string){
  return await this.db.findOneAndUpdate({_id :id},{$set:{isBlock:false}})
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