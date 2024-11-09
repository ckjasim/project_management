import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IJwt from '../infrastructure/interfaces/IJwt';
import { COOKIE_MAXAGE } from '../infrastructure/constants/timeAndDuration';
import IEmailService from '../infrastructure/interfaces/IEmailService';
import { SessionData } from 'express-session';
import IEmployeeController from '../infrastructure/interfaces/IEmployeeController';
import { IEmployeeInteractor } from '../infrastructure/interfaces/IEmployeeInteractors';
import { validationResult } from 'express-validator';

@injectable()
class EmployeeAuthController implements IEmployeeController {
  private interactor: IEmployeeInteractor;
  private jwt: IJwt;
  private emailService: IEmailService;

  constructor(
    @inject(INTERFACE_TYPES.EmployeeInteractor)
    employeeInter: IEmployeeInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
    @inject(INTERFACE_TYPES.NodeMailerService) emailServ: IEmailService
  ) {
    this.interactor = employeeInter;
    this.jwt = jwt;
    this.emailService = emailServ;
  }

  async loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      console.log(errors);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({ message: 'validation error', errors: errors.array() });
      }
      console.log(req.body);
      const { email, password, projectCode } = req.body;
      const user = await this.interactor.findUserByEmail(email);
      if (!user) {
        res.status(400);
        throw new Error('User not found , Please create an account');
      }

      const comparePassword = await this.interactor.comparePassword(
        password,
        user.password
      );
      console.log(comparePassword);
      if (!comparePassword) {
        res.status(400);
        throw new Error('invalid password');
      }
      const projectCodeSample=['11111','22222','33333']
      if(!projectCodeSample.includes(projectCode)){
        res.status(400);
        throw new Error('invalid project code');
      }
      const tokenData = {
       email,
        projectCode,
          role:'employee'
      };
      const token = this.jwt.generateToken(tokenData);
      const refreshToken = this.jwt.generateRefreshToken(tokenData);
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
      res.status(200).json({ message: 'Successfully logged in', data: { user, token } });
    } catch (error) {
      next(error);
    }
  }
  async registerHandler(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);

      const errors = validationResult(req);
      console.log(errors);
      console.log(errors.array());
      if (!errors.isEmpty()) {
       return res
          .status(400)
          .json({ message: 'validation error', errors: errors.array() });
      }
      const { name, email, password, mobile, jobRole, projectCode, img ,organization} =
        req.body;
      const user = await this.interactor.findUserByEmail(email);
      if (user) {
       res.status(400);
        throw new Error('already have an account please login');
      }
      const projectCodeSample=['11111','22222','33333']
      if(!projectCodeSample.includes(projectCode)){
        res.status(400);
        throw new Error('invalid project code');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(otp);

      await this.emailService.sendOTP(email, otp);

      const otpData = {
        email,
        otp,
      };
      const org = organization.toLowerCase().replace(/\s+/g, '')

      const otpd = await this.interactor.saveOtp(otpData);
      const data = {
        name,
        email,
        password,
        role: 'employee',
        isBlock: false,
        mobile,
        jobRole,
        projectCode,
        img,
        organization:org
      };

      const tempToken = this.jwt.generateToken(data, '10m');
      res.cookie('employeeTemp', tempToken, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        path: '/',
      });

      res
        .status(201)
        .json({ message: 'otp shared into your email', otp, otpd });
    } catch (error) {
      next(error);
    }
  }
  async verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['employeeTemp'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decodedData = await this.jwt.verifyToken(token);
      const {
        name,
        email,
        password,
        role,
        isBlock,
        mobile,
        jobRole,
        projectCode,
        organization,
        img,
      } = decodedData;
      const { otp } = req.body;

      const storedOtp = await this.interactor.getOtp(email);
      const compareOtp = await this.interactor.compareOtp(otp, storedOtp.otp);
      if (!compareOtp) {
        res.status(400);
        throw new Error('invalid Otp');
      }
      const data = {
        email,
        name,
        password,
        role,
        isBlock,
        mobile,  
        jobRole,
        projectCode,
        organization
      };

      await this.interactor.createUser(data);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      const tokenData = {
        email,
        projectCode,
        role:'employee'
      };
      
      const refreshToken = this.jwt.generateRefreshToken(tokenData);
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

      res
      .status(201)
      .json({ message: 'user created successfully' });
    } catch (error) {
      next(error);
    }
  }
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { jwt: refreshToken } = req.cookies;
      const accessToken = await this.interactor.execute(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['employeeTemp'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decodedData = await this.jwt.verifyToken(token);
      const { email } = decodedData;
      console.log(email)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await this.emailService.sendOTP(email, otp);
      const otpData = { otp, email };
      await this.interactor.saveOtp(otpData);
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeAuthController;
