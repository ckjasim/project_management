// infrastructure/interactors/UserInteractor.ts
import { inject, injectable } from 'inversify';
import IUserRepository from '../infrastructure/interfaces/IUserRepository';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import { IUserInteractor } from '../infrastructure/interfaces/IUserInteractors';
import IUser from '../infrastructure/interfaces/IUser';
import bcrypt from 'bcryptjs';
import IOtp from '../infrastructure/interfaces/IOtp';
import IOtpRepository from '../infrastructure/interfaces/IOtpRepository';
import { IAdminInteractor } from '../infrastructure/interfaces/IAdminInteractors';
import IEmployeeRepository from '../infrastructure/interfaces/IEmployeeRepository';
import IEmployee from '../infrastructure/interfaces/IEmployee';
import IRefreshToken from '../infrastructure/interfaces/IRefreshToken';
import IRefreshTokenRepository from '../infrastructure/interfaces/IRefreshTokenRepository';

@injectable()
export default class AdminInteractor implements IAdminInteractor {
  private userRepo: IUserRepository;
  private employeeRepo: IEmployeeRepository;
  private refreshRepo: IRefreshTokenRepository;

  constructor(
    @inject(INTERFACE_TYPES.RefreshTokenRepository) refreshRepo: IRefreshTokenRepository,
    @inject(INTERFACE_TYPES.UserRepository) userRepo: IUserRepository,
    @inject(INTERFACE_TYPES.EmployeeRepository)
    employeeRepo: IEmployeeRepository
  ) {
    this.userRepo = userRepo;
    this.employeeRepo = employeeRepo;
    this.refreshRepo = refreshRepo;
  }

  async getAllUsers(): Promise<IUser[] | null> {
    try {
      return await this.userRepo.find();
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async getAllEmployees(): Promise<IEmployee[] | null> {
    try {
      return await this.employeeRepo.find();
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  async manageEmployee(email:string): Promise<IEmployee | null> {
    try {
      return await this.employeeRepo.blockOrUnblock(email);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  async manageUser(email:string): Promise<IEmployee | null> {
    try {
      return await this.userRepo.blockOrUnblock(email);
    } catch (error) {
      console.error('Error finding user by email:', error);
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
}
