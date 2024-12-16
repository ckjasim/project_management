// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';
import IUserRepository from '../infrastructure/interfaces/IUserRepository';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import { IUserInteractor } from '../infrastructure/interfaces/IUserInteractors';
import IUser from '../infrastructure/interfaces/IUser';
import bcrypt from 'bcryptjs';
import IOtp from '../infrastructure/interfaces/IOtp';
import IOtpRepository from '../infrastructure/interfaces/IOtpRepository';
import IEmployeeRepository from '../infrastructure/interfaces/IEmployeeRepository';
import IEmployee from '../infrastructure/interfaces/IEmployee';
import { IEmployeeInteractor } from '../infrastructure/interfaces/IEmployeeInteractors';
import IRefreshToken from '../infrastructure/interfaces/IRefreshToken';
import IRefreshTokenRepository from '../infrastructure/interfaces/IRefreshTokenRepository';
import IJwt from '../infrastructure/interfaces/IJwt';
import { Types } from 'mongoose';
import IInvitation from '../infrastructure/interfaces/IInvitation';
import IInvitationRepository from '../infrastructure/interfaces/IInvitationRepository';

@injectable()
export default class EmployeeInteractor implements IEmployeeInteractor {
  private repository: IEmployeeRepository;
  private refreshRepo: IRefreshTokenRepository;
  private otpRepo: IOtpRepository;
  private userRepo: IUserRepository;
  private invitRepo: IInvitationRepository;
  private jwt: IJwt;

  constructor(
    @inject(INTERFACE_TYPES.EmployeeRepository)
    employeeRepo: IEmployeeRepository,
    @inject(INTERFACE_TYPES.UserRepository)
    userRepo: IUserRepository,
    @inject(INTERFACE_TYPES.OtpRepository) otpRepo: IOtpRepository,
    @inject(INTERFACE_TYPES.invitationRepository) invitRepo: IInvitationRepository,
    @inject(INTERFACE_TYPES.RefreshTokenRepository)
    refreshRepo: IRefreshTokenRepository,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt
  ) {
    this.repository = employeeRepo;
    this.refreshRepo = refreshRepo;
    this.invitRepo = invitRepo;
    this.otpRepo = otpRepo;
    this.userRepo = userRepo;
    this.jwt = jwt;
  }
  async execute(refreshToken: string): Promise<string> {
    const decoded = await this.jwt.verifyRefreshToken(refreshToken);
    const newAccessToken = await this.jwt.generateToken(decoded.email);
    return newAccessToken;
  }
  async findUserByEmail(email: string,organization:string): Promise<IEmployee | null> {
    try {
      return await this.repository.findByEmail(email,organization);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async createUser(data: IEmployee): Promise<IEmployee> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async createInvitation(data: IInvitation): Promise<IInvitation> {
    try {
      return await this.invitRepo.create(data);
    } catch (error) {
      console.error('Error creating invitaion:', error);
      throw error;
    }
  }
  async findInvitation(data: any): Promise<IInvitation | null> {
    try {
      return await this.invitRepo.findByToken(data);
    } catch (error) {
      console.error('Error finding invitation:', error);
      throw error;
    }
  }
  async findInvitationByEmail(email: string,organization:any): Promise<IInvitation | null> {
    try {
      
      return await this.invitRepo.findInvitaionByEmail(email,organization);
    } catch (error) {
      console.error('Error finding invitation:', error);
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



  async findUserByEmailForLogin(email: string): Promise<IEmployee | null> {
    try {
      return await this.repository.findByEmailForLogin(email);
    } catch (error) {
      console.error('Error finding user by email:', error);
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
  async createRefreshToken(data: IRefreshToken): Promise<IRefreshToken> {
    try {
      return await this.refreshRepo.create(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async getEmployee(organization:string): Promise<any> {
    try {
      console.log('jjj')
      return await this.repository.getEmployee(organization);
    } catch (error) {
      console.error('Error getting employee by organization:', error);
      throw error;
    }
  }
  async getUser(organization:string): Promise<any> {
    try {
      console.log('jjj')
      return await this.userRepo.getUser(organization);
    } catch (error) {
      console.error('Error getting employee by organization:', error);
      throw error;
    }
  }
}
