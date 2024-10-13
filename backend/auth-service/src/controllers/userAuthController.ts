import { Request, Response, NextFunction } from 'express';
import { IUserInteractor } from '../infrastructure/interfaces/IUserInteractors';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IUserController from '../infrastructure/interfaces/IUserController';
import IJwt from '../infrastructure/interfaces/IJwt';
import { COOKIE_MAXAGE } from '../infrastructure/constants/timeAndDuration';
import IEmailService from '../infrastructure/interfaces/IEmailService';
import {SessionData } from 'express-session';

@injectable()
class userAuthController implements IUserController {
  private interactor: IUserInteractor;
  private jwt: IJwt;
  private emailService: IEmailService;

  constructor(
    @inject(INTERFACE_TYPES.UserInteractor) userInter: IUserInteractor,
    @inject(INTERFACE_TYPES.jwt) jwt: IJwt,
    @inject(INTERFACE_TYPES.NodeMailerService) emailServ: IEmailService
  ) {
    this.interactor = userInter;
    this.jwt = jwt;
    this.emailService = emailServ;
  }

  async loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      const { email, password } = req.body;
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
      const { name, email, password } = req.body;
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
        role: 'project manager',
        isBlock: false,
      };
      // req.session.userData = data;

     
      res
        .status(201)
        .json({ message: 'otp shared into your email', otp, otpd });
    } catch (error) {
      next(error);
    }
  }
  async verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp ,email} = req.body;
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

export default userAuthController;
