import { Request, Response, NextFunction } from 'express';
import { IUserInteractor } from '../infrastructure/interfaces/IUserInteractors';
import { inject, injectable } from 'inversify';
import INTERFACE_TYPES from '../infrastructure/constants/inversify';
import IUserController from '../infrastructure/interfaces/IUserController';
import IJwt from '../infrastructure/interfaces/IJwt';
import { COOKIE_MAXAGE } from '../infrastructure/constants/timeAndDuration';
import IEmailService from '../infrastructure/interfaces/IEmailService';
import { SessionData } from 'express-session';
import { validationResult } from 'express-validator';

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
        return res.status(400).json({ message: 'User not found, please create an account' });
      }
  
      const comparePassword = await this.interactor.comparePassword(password, user.password);
      if (!comparePassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = this.jwt.generateToken(user.email as string);
      const refreshToken = this.jwt.generateRefreshToken(user.email as string);
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
  
  async registerHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({ message: 'validation error', errors: errors.array() });
        return;
      }

      const { name, email, password } = req.body;
      const user = await this.interactor.findUserByEmail(email);
      if (user) {
        res
          .status(400)
          .json({ message: 'already have an account, please login' });
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.emailService.sendOTP(email, otp);

      const otpData = { otp, email };
      await this.interactor.saveOtp(otpData);

      const data = {
        name,
        email,
        password,
        role: 'project manager',
        isBlock: false,
      };

      const tempToken = this.jwt.generateToken(data, '10m');
      res.cookie('tempJwt', tempToken, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        path: '/',
      });

      res.status(201).json({ message: 'OTP sent to your email', otp });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['tempJwt'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decodedData = await this.jwt.verifyToken(token);
      const { email, name, password, role, isBlock } = decodedData;

      const { otp } = req.body;
      const storedOtp = await this.interactor.getOtp(email);
      const compareOtp = await this.interactor.compareOtp(
        otp,
        storedOtp.otp.toString()
      );
      if (!compareOtp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      const data = { email, name, password, role, isBlock };
      await this.interactor.createUser(data);


   
      const refreshToken = this.jwt.generateRefreshToken(email as string);
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

      // const userToken = this.jwt.generateToken(email);
      // res.cookie('jwt', userToken, {
      //   httpOnly: true,
      //   maxAge: COOKIE_MAXAGE,
      //   path: '/',
      //   sameSite: 'lax',
      // });

      return res.status(201).json({ message: 'User created successfully' });
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
      const token = req.cookies['tempJwt'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decodedData = await this.jwt.verifyToken(token);
      const { email } = decodedData;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await this.emailService.sendOTP(email, otp);
      const otpData = { otp, email };
      await this.interactor.saveOtp(otpData);
    } catch (error) {
      next(error);
    }
  }
}

export default userAuthController;
