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
 async verifyInvitationHandler(req: Request, res: Response, next: NextFunction):Promise<any> {
    const token = Object.keys(req.body)[0];
    console.log("Extracted token:", token);
      const invitation = await this.interactor.findInvitation(token)
      console.log(invitation)

      if (!invitation) {
        return res.status(400).json({ 
          message: "Invalid or expired invitation" 
        });
      }
  }
  async employeeInvitation(req: Request, res: Response, next: NextFunction): Promise<any> {
    console.log(req.body,'kkkkkkkkkkkkkkkkkkk')
  const {name,jobRole,email}=req.body
  const token = req.cookies['jwt'];
  console.log(token);
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
console.log(user,"user-----------------------")


  const existingEmployee = await this.interactor.findUserByEmail(email,user.organization)

  console.log(existingEmployee,'existing------employee')
  if (existingEmployee) {
    return res.status(400).json({ 
      message: "Employee with this email already exists in your organization" 
    });
  }
  const invitationToken = uuidv4();
  const invitationData={
    email,
    organization: user.organization,
    invitedBy: user._id,
    token: invitationToken,
    jobRole,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
  const invitation = await this.interactor.createInvitation(invitationData);

  console.log(invitation,'jjjjjjjjjjaaaaaaaaaaaaasssssssssssiiiiiiiiiii')

  const invitationLink = `http://localhost:5173/auth/employeeSignup?token=${invitationToken}`;
  console.log(invitationLink)

  const data = {
    to: email, 
    name, 
    invitationLink,
    invitedBy: user.email,
    jobRole
  }

  await this.emailService.sendInvitation(data);
  res.send("email has been send into mail")
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
      const user = await this.interactor.findUserByEmail(email,projectCode);
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
      const projectCodeSample = ['11111', '22222', '33333','FSJVE',];
      if (!projectCodeSample.includes(projectCode)) {
        res.status(400);
        throw new Error('invalid project code');
      }
      const tokenData = {
        email,
        projectCode,
        role: 'employee',
        organization:user?.organization
        
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
      

     
      const {
       
        password,
        mobile,
        
       token,
        img,
      
      } = req.body;
  
      console.log("Extracted token:", token);
        const invitation = await this.interactor.findInvitation(token)
        console.log(invitation)
  
        if (!invitation) {
          return res.status(400).json({ 
            message: "Invalid or expired invitation" 
          });
        }
      // const user = await this.interactor.findUserByEmail(email,organization);
      // if (user) {
      //   res.status(400);
      //   throw new Error('already have an account please login');
      // }
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(otp);

      // await this.emailService.sendOTP(email, otp);

      // const otpData = {
      //   email,
      //   otp,
      // };
      // const org = organization.toLowerCase().replace(/\s+/g, '');

      // const otpd = await this.interactor.saveOtp(otpData);
      // const data = {
      //   name,
      //   email,
      //   password,
      //   role: 'employee',
      //   isBlock: false,
      //   mobile,
      //   jobRole,
      //   projectCode,
      //   img,
      //   organization: org,
      // };

      // const tempToken = this.jwt.generateToken(data, '10m');
      // res.cookie('employeeTemp', tempToken, {
      //   httpOnly: true,
      //   maxAge: 10 * 60 * 1000,
      //   path: '/',
      // });

      // res
      //   .status(201)
      //   .json({ message: 'otp shared into your email', otp, otpd });
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
        organization,
      };

     const newUser =  await this.interactor.createUser(data);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      const tokenData = {
        email,
        projectCode,
        role: 'employee',
        organization
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

      res.status(201).json({ message: 'user created successfully',newUser });
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
      console.log('81818181881')
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
console.log(decodedData,'11111111111111111122222222222222222222000000000000000')
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
