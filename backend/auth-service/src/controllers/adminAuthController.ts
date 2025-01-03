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
import kafkaWrapper from '../infrastructure/util/kafka/kafkaWrapper';
import { Producer } from 'kafkajs';
import { EmployeeUpdatedPublisher, UserUpdatedPublisher } from '../infrastructure/util/kafka/producer/producer';

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
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        const load= {adminEmail,role:'admin'}
        const token = this.jwt.generateToken(load);

        const refreshToken = this.jwt.generateRefreshToken(load);

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
        const data={
          token,
          role:"admin"
        }

        res.status(200).json({ message: 'Successfully logged in',data });
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
      console.log('jjjjjjjjjjjjjjjjjjjjjjj')
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
      console.log(employees);
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
      console.log(employeeStatus);

    
      if (employeeStatus) {
        await new EmployeeUpdatedPublisher(kafkaWrapper.producer as Producer).produce({
          _id: employeeStatus?._id! as string,
          isBlock:employeeStatus?.isBlock
        });
      }
      res.status(201).json({ message: 'employee Blocked', employeeStatus });
    } catch (error) {
      next(error);
    }
  }
  async manageUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
     
      const employeeStatus = await this.interactor.manageUser(email);
      console.log(employeeStatus);

      if (employeeStatus) {
        await new UserUpdatedPublisher(kafkaWrapper.producer as Producer).produce({
          _id: employeeStatus?._id! as string,
          isBlock:employeeStatus.isBlock
        });
      }

      res.status(201).json({ message: 'user Blocked', employeeStatus });
    } catch (error) {
      next(error);
    }
  }
}

export default adminAuthController;
