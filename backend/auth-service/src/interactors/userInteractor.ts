
import { inject, injectable } from 'inversify';
import IUserRepository from '../infrastructure/interfaces/IUserRepository';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import { IUserInteractor } from '../infrastructure/interfaces/IUserInteractors';
import IUser from '../infrastructure/interfaces/IUser';
import bcrypt from 'bcryptjs';
import IOtp from '../infrastructure/interfaces/IOtp';
import IOtpRepository from '../infrastructure/interfaces/IOtpRepository';
import IRefreshTokenRepository from '../infrastructure/interfaces/IRefreshTokenRepository';
import IRefreshToken from '../infrastructure/interfaces/IRefreshToken';
import IJwt from '../infrastructure/interfaces/IJwt';
import IOrganizationRepository from '../infrastructure/interfaces/IOrganizationRepository';
import IOrganization from '../infrastructure/interfaces/IOrganization';
import { DriveModel } from '../database/model/driveModel';
import IDrive from '../infrastructure/interfaces/IDrive';

@injectable()
export default class UserInteractor implements IUserInteractor {
  private repository: IUserRepository;
  private orgRepo: IOrganizationRepository;
  private otpRepo: IOtpRepository;
  private refreshRepo: IRefreshTokenRepository;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.UserRepository) userRepo: IUserRepository,
    @inject(INTERFACE_TYPES.OrganizatonRepository) orgRepo: IOrganizationRepository,
    @inject(INTERFACE_TYPES.OtpRepository) otpRepo: IOtpRepository,
    @inject(INTERFACE_TYPES.RefreshTokenRepository)
    refreshRepo: IRefreshTokenRepository,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt
  ) {
    this.repository = userRepo;
    this.orgRepo = orgRepo;
    this.otpRepo = otpRepo;
    this.refreshRepo = refreshRepo;
    this.jwt = jwt;
  }
  async execute(refreshToken: string): Promise<string> {
    const decoded = await this.jwt.verifyRefreshToken(refreshToken);
    if (!decoded) throw new Error('Invalid refresh token'); 
    console.log(decoded,'deddddddddddddddooooooooooooooooooooooo')
    const newAccessToken = this.jwt.generateToken(decoded.user);
    return newAccessToken;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.repository.findByEmail(email);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  async findUserById(id: string): Promise<IUser | null> {
    try {
      return await this.repository.findByEmail(id);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async createOrganization(data: IOrganization): Promise<IOrganization> {
    try {
      return await this.orgRepo.create(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async createUser(data: IUser): Promise<IUser> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async createRefreshToken(data: IRefreshToken): Promise<IRefreshToken> {
    try {
      return await this.refreshRepo.create(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async comparePassword(password: string, hashPassword: string) {
    try {
      return bcrypt.compareSync(password, hashPassword);
    } catch (error) {
      console.error('Error comparing password:', error);
      throw error;
    }
  }
  async saveOtp(data: IOtp): Promise<IOtp> {
    try {
      return await this.otpRepo.create(data);
    } catch (error) {
      console.error('Error creating otp:', error);
      throw error;
    }
  }

  async getOtp(email: string): Promise<IOtp> {
    try {
      const otpDocument = await this.otpRepo.getOtp(email);
      if (!otpDocument) {
        throw new Error('OTP not found for the provided email');
      }
      return otpDocument;
    } catch (error) {
      console.error('Error retrieving OTP:', error);
      throw error;
    }
  }

  async compareOtp(otp: string, hashOtp: string) {
    try {
      return bcrypt.compareSync(otp, hashOtp);
    } catch (error) {
      console.error('Error comparing otp:', error);
      throw error;
    }
  } 

  async findDriveByEmail(email: string) {
    try {
      return await DriveModel.findOne({ email });
    } catch (error) {
      console.error('Error comparing otp:', error);
      throw error;
    }
  }

  async updateDriveTokens(email: string, tokens: { accessToken: string; refreshToken: string }): Promise<void> {
    await DriveModel.updateOne({ email }, { $set: tokens });
  }

  async createDriveEntry(data: IDrive): Promise<void> {
    const driveEntry = new DriveModel(data);
    await driveEntry.save();
  }

}
