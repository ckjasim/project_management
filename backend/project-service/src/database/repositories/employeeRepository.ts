import IUser from "../../infrastructure/interfaces/IUser";
import IUserRepository from "../../infrastructure/interfaces/IUserRepository";
import { employeeModel } from "../model/employeeModel";
import { Model } from "mongoose";
import { injectable } from "inversify";
import IEmployeeRepository from "../../infrastructure/interfaces/ITaskRepository";
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
}