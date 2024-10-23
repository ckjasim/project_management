
import { Model } from "mongoose";
import { injectable } from "inversify";
import IRefreshToken from "../../infrastructure/interfaces/IRefreshToken";
import refreshTokenModel from "../model/refreshTokenModel";
import IRefreshTokenRepository from "../../infrastructure/interfaces/IRefreshTokenRepository";

@injectable()
export default class refreshTokenRepository implements IRefreshTokenRepository{
  private readonly db:Model<IRefreshToken>
constructor(){
  this.db=refreshTokenModel
}


async create(data:IRefreshToken){
  return await this.db.create(data)
}

}