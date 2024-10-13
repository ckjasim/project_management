
import { Model } from "mongoose";
import { injectable } from "inversify";
import IOtpRepository from "../../infrastructure/interfaces/IOtpRepository";
import IOtp from "../../infrastructure/interfaces/IOtp";
import { otpModel } from "../model/otpModel";

@injectable()
export default class OtpRepository implements IOtpRepository{
  private readonly db:Model<IOtp>
constructor(){
  this.db=otpModel
}

async getOtp(email:string){
  return await this.db.findOne({email})
}
async create(data:IOtp){
  return await this.db.create(data)
}
}