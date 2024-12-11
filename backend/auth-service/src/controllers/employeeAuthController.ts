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
import { v4 as uuidv4 } from 'uuid';
import CloudinaryV2 from '../infrastructure/util/cloudinary';
import { EmployeeCreatedPublisher } from '../infrastructure/util/kafka/producer/producer';
import kafkaWrapper from '../infrastructure/util/kafka/kafkaWrapper';
import { Producer } from 'kafkajs';

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
  async verifyInvitationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const token = Object.keys(req.body)[0];
    console.log('Extracted token:', token);
    const invitation = await this.interactor.findInvitation(token);
    console.log(invitation);

    if (!invitation) {
      return res.status(400).json({
        message: 'Invalid or expired invitation',
      });
    }
  }

  

  async employeeInvitation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { name, jobRole, email } = req.body;
    const token = req.cookies['jwt'];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    let decodedData;
    try {
      decodedData = await this.jwt.verifyRefreshToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { user } = decodedData;

    const existingEmployee = await this.interactor.findUserByEmail(
      email,
      user.organization
    );

    if (existingEmployee) {
      return res.status(400).json({
        message: 'Employee with this email already exists in your organization',
      });
    }
  
    const existingInvitation = await this.interactor.findInvitationByEmail(
      email,
      user.organization
    );
    if (existingInvitation) {
      return res.status(400).json({
        message: 'Invitation is already send to this email',
      });
    }

    const invitationToken = uuidv4();
    const invitationData = {
      name,
      email,
      organization: user.organization,
      invitedBy: user._id,
      token: invitationToken,
      jobRole,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    const invitation = await this.interactor.createInvitation(invitationData);

    const invitationLink = `http://localhost:5173/auth/employeeSignup?token=${invitationToken}`;
    console.log(invitationLink);

    const data = {
      to: email,
      name,
      invitationLink,
      invitedBy: user.email,
      jobRole,
    };

    await this.emailService.sendInvitation(data);
    res.send('email has been send into mail');
  }

  async loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
      // const errors = validationResult(req);
      // console.log(errors);
      // console.log(errors.array());
      // if (!errors.isEmpty()) {
      //   res
      //     .status(400)
      //     .json({ message: 'validation error', errors: errors.array() });
      // }
      console.log(req.body);
      const { email, password } = req.body;
      const user = await this.interactor.findUserByEmailForLogin(email);
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
     
      const tokenData = {
        _id: user?._id,
        email: user?.email,
        role: 'employee',
        organization: user?.organization,
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
      res
        .status(200)
        .json({ message: 'Successfully logged in', data: { user, token } });
    } catch (error) {
      next(error);
    }
  }
  async registerHandler(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);

      const { password, mobile, token, image } = req.body;

      const invitation = await this.interactor.findInvitation(token);

      if (!invitation) {
        return res.status(400).json({
          message: 'Invalid or expired invitation',
        });
      }

      const existingEmployee = await this.interactor.findUserByEmail(
        invitation?.email,
        invitation?.organization?._id.toString()
      );
      if (existingEmployee) {
        res.status(400);
        throw new Error('already have an account please login');
      }

      const result = await CloudinaryV2.uploader.upload(image, {
        folder: 'employee',
      });

      const data = {
        email: invitation?.email,
        name: invitation?.name,
        password,
        role: 'employee',
        mobile,
        jobRole: invitation?.jobRole,
        organization: invitation?.organization?._id,
        profileImage: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      };

      const newUser = await this.interactor.createUser(data);
      

      if (newUser) {
 

        await new EmployeeCreatedPublisher(
          kafkaWrapper.producer as Producer
        ).produce({
          _id: newUser._id! as string,
          name: newUser.name as string,
          email: newUser.email as string,
          organization: newUser.organization as unknown as string,
          role: newUser.role! as string,
          password: newUser.password,
          jobRole: newUser.jobRole as string,
          mobile: newUser.mobile,
          profileImage: {
            public_id: result.public_id,
            url: result.secure_url,
          },
          projectManager:invitation.invitedBy as unknown as string,
        });
      }
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      const tokenData = {
        _id: newUser?._id,
        email: newUser?.email,
        role: 'employee',
        organization: newUser?.organization,
      };

      const refreshToken = this.jwt.generateRefreshToken(tokenData);
      const refreshData = {
        email: newUser?.email,
        token: refreshToken,
        expiresAt,
      };
      await this.interactor.createRefreshToken(refreshData);

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: COOKIE_MAXAGE,
        path: '/',
      });

      res.status(201).json({ message: 'employee created successfully', newUser });
    } catch (error) {
      next(error);
    }
  }
  async verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
    try {
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
      console.log(email);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await this.emailService.sendOTP(email, otp);
      const otpData = { otp, email };
      await this.interactor.saveOtp(otpData);
    } catch (error) {
      next(error);
    }
  }
  // async employeeByOrganization(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const token = req.cookies['jwt'];
  //     if (!token) {
  //       return res.status(401).json({ message: 'No token provided' });
  //     }

  //     const decodedData = await this.jwt.verifyToken(token);
  //     const { user } = decodedData;
  //     const organization = user.organization;
  //     await this.interactor.getEmployee(organization);;
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  async employeeByOrganization(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log('81818181881');
      const token = req.cookies['jwt'];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      let decodedData;
      try {
        decodedData = await this.jwt.verifyRefreshToken(token);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const { user } = decodedData;

      const organization = user.organization;

      const employees = await this.interactor.getEmployee(organization);

      res
        .status(200)
        .send({ message: 'employees successfully found', employees });
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeAuthController;
