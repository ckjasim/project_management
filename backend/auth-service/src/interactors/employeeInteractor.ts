// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from "inversify";
import IUserRepository from "../infrastructure/interfaces/IUserRepository";
import INTERFACE_TYPES from "../infrastructure/constants/inversify";
import { IUserInteractor } from "../infrastructure/interfaces/IUserInteractors";
import IUser from "../infrastructure/interfaces/IUser"
import bcrypt from "bcryptjs"
import IOtp from "../infrastructure/interfaces/IOtp";
import IOtpRepository from "../infrastructure/interfaces/IOtpRepository";
import IEmployeeRepository from "../infrastructure/interfaces/IEmployeeRepository";
import IEmployee from "../infrastructure/interfaces/IEmployee";

@injectable()
export default class EmployeeInteractor implements IUserInteractor {
  private repository: IEmployeeRepository;
  private otpRepo:IOtpRepository


  constructor(@inject(INTERFACE_TYPES.EmployeeRepository) employeeRepo: IEmployeeRepository,@inject(INTERFACE_TYPES.OtpRepository) otpRepo :IOtpRepository ) {
    this.repository = employeeRepo;
    this.otpRepo=otpRepo
  }

  async findUserByEmail(email: string): Promise<IEmployee | null> {
    try {
      return await this.repository.findByEmail(email);
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
  async comparePassword (password: string,hashPassword :string) {
    try {
      return bcrypt.compareSync(password,hashPassword)
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
  async compareOtp (otp: string,hashOtp :string) {
    try {
      return bcrypt.compareSync(otp,hashOtp)
    } catch (error) {
      console.error('Error comparing otp:', error);
      throw error;
    }
  }
  
}
