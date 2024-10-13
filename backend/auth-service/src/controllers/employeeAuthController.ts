import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IJwt from '../infrastructure/interfaces/IJwt';
import { COOKIE_MAXAGE } from '../infrastructure/constants/timeAndDuration';
import IEmailService from '../infrastructure/interfaces/IEmailService';
import { SessionData } from 'express-session';
import IEmployeeController from '../infrastructure/interfaces/IEmployeeController';
import { IEmployeeInteractor } from '../infrastructure/interfaces/IEmployeeInteractors';

@injectable()
class EmployeeAuthController implements IEmployeeController {
  private interactor: IEmployeeInteractor;
  private jwt: IJwt;
  private emailService: IEmailService;

  constructor(
    @inject(INTERFACE_TYPES.EmployeeInteractor) employeeInter: IEmployeeInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
    @inject(INTERFACE_TYPES.NodeMailerService) emailServ: IEmailService
  ) {
    this.interactor = employeeInter;
    this.jwt = jwt;
    this.emailService = emailServ;
  }

  async loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
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

      const token = this.jwt.generateToken(user._id as string);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: COOKIE_MAXAGE,
        path: '/',
      });
      res.status(200).json({ message: 'succefully logged In', data: user });
    } catch (error) {
      next(error);
    }
  }
  async registerHandler(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      const { name, email, password, mobile, jobRole, projectCode, img } =
        req.body;
      const user = await this.interactor.findUserByEmail(email);
      if (user) {
        res.status(400);
        throw new Error('already have an account please login');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(otp);

      await this.emailService.sendOTP(email, otp);

      const otpData = {
        email,
        otp,
      };

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
      };
      // req.session.userData = data;

      //-----------

      const newUser = await this.interactor.createUser(data);
      const token = this.jwt.generateToken(newUser._id as string);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: COOKIE_MAXAGE,
        path: '/',
      });
      // res.status(201).json({ message: 'user created successfully', newUser });
      //-----------

      res
        .status(201)
        .json({ message: 'otp shared into your email', otp, otpd ,newUser});
    } catch (error) {
      next(error);
    }
  }
  async verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;
      // const email = req.session.userData?.email!;
      // console.log(req.session.userData)

      const storedOtp = await this.interactor.getOtp(email);
      const compareOtp = await this.interactor.compareOtp(otp, storedOtp.otp);
      if (!compareOtp) {
        res.status(400);
        throw new Error('invalid Otp');
      }
      //  const newUser = await this.interactor.createUser(data);
      // const token = this.jwt.generateToken(newUser._id as string);
      // res.cookie('jwt', token, {
      //   httpOnly: true,
      //   maxAge: COOKIE_MAXAGE,
      //   path: '/',
      // });
      // res
      // .status(201)
      // .json({ message: 'user created successfully',newUser });
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeAuthController;
