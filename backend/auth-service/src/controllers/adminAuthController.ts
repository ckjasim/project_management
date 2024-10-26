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

      const errors = validationResult(req);
      console.log(errors)
      console.log(errors.array())
      if (!errors.isEmpty()) {
        res.status(400)
        .json({ message: 'validation error',  errors:errors.array() })
      }

      const { email, password } = req.body;
      console.log(email,password)
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      console.log(adminEmail)
      console.log(password)
      if (email === adminEmail && password === adminPassword) {
        const token = this.jwt.generateToken(adminEmail as string);
        const refreshToken = this.jwt.generateRefreshToken(adminEmail as string);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
    
        const refreshData = {   
          email,
          token: refreshToken,
          expiresAt,
        };
        await this.interactor.createRefreshToken(refreshData);
    
        res.cookie('jwt', refreshToken, {
          httpOnly: true,
          maxAge: COOKIE_MAXAGE,
          path: '/',
        });
    
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
  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const blockedUser = await this.interactor.blockUser(id);

      res.status(201).json({ message: 'user Blocked', blockedUser });
    } catch (error) {
      next(error);
    }
  }
  async blockEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const blockedEmployee = await this.interactor.blockEmployee(id);

      res.status(201).json({ message: 'employee Blocked', blockedEmployee });
    } catch (error) {
      next(error);
    }
  }
  async unBlockEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const employee = await this.interactor.unBlockEmployee(id);

      res.status(201).json({ message: 'employee unblocked', employee });
    } catch (error) {
      next(error);
    }
  }
  async unBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const user = await this.interactor.unBlockUser(id);

      res.status(201).json({ message: 'user unblocked', user });
    } catch (error) {
      next(error);
    }
  }
}

export default adminAuthController;
