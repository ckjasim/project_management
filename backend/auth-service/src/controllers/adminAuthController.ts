import { Request, Response, NextFunction } from 'express';
import { IUserInteractor } from '../infrastructure/interfaces/IUserInteractors';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IJwt from '../infrastructure/interfaces/IJwt';
import { COOKIE_MAXAGE } from '../infrastructure/constants/timeAndDuration';
import IEmailService from '../infrastructure/interfaces/IEmailService';
import { SessionData } from 'express-session';
import IAdminController from '../infrastructure/interfaces/IAdminController';
import { IAdminInteractor } from '../infrastructure/interfaces/IAdminInteractors';
import { validationResult } from 'express-validator';

@injectable()
class adminAuthController implements IAdminController {
  private interactor: IAdminInteractor;
  private jwt: IJwt;
 
  constructor(
    @inject(INTERFACE_TYPES.AdminInteractor) adminInter: IAdminInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt
  ) {
    this.interactor = adminInter;
    this.jwt = jwt;
  }
 

  async loginHandler(req: Request, res: Response, next: NextFunction) {
    try {

      
      const { email, password } = req.body;
      console.log(email,password)
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      console.log(adminEmail)
      console.log(password)
      if (email === adminEmail && password === adminPassword) {
        console.log('1111')
        const token = this.jwt.generateToken(adminEmail as string);
        console.log('1122')
        const refreshToken = this.jwt.generateRefreshToken(adminEmail as string);
        console.log('13')
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        
        const refreshData = {   
          email,
          token: refreshToken,
          expiresAt,
        };
        console.log('14')
        await this.interactor.createRefreshToken(refreshData);
        
        console.log('15')
        res.cookie('jwt', refreshToken, {
          httpOnly: true,
          maxAge: COOKIE_MAXAGE,
          path: '/',
        });
        
        console.log('16')
        res.status(200).json({ message: 'Successfully logged in'});
        
      } else {
        res.status(400);
        throw new Error('invalid email or password');
      }
    } catch (error) {
      next(error);
    }
  }
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.interactor.getAllUsers();
      if (!users) {
        res.status(400);
        throw new Error('no users found');
      }
      console.log(users,'nnnnnnnnnnn')
      res.status(201).json({ message: 'users List', users });
    } catch (error) {
      next(error);
    }
  }
  async getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await this.interactor.getAllEmployees();
      if (!employees) {
        res.status(400);
        throw new Error('no employees found');
      }
      res.status(201).json({ message: 'employees List', employees });
    } catch (error) {
      next(error);
    }
  }
  
  async manageEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const employeeStatus = await this.interactor.manageEmployee(email);

      res.status(201).json({ message: 'employee Blocked', employeeStatus });
    } catch (error) {
      next(error);
    }
  }
  async manageUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
console.log(email)

      console.log("employeeStatus")
      const employeeStatus = await this.interactor.manageUser(email);
      console.log("employeeStatus")
      console.log(employeeStatus)

      res.status(201).json({ message: 'employee Blocked', employeeStatus });
    } catch (error) {
      next(error);
    }
  }
 
}

export default adminAuthController;
