import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import IJwt from '../interfaces/IJwt';
import INTERFACE_TYPES from '../constants/inversify';
import { UserModel } from '../../database/model/userModel';
import { EmployeeModel } from '../../database/model/employeeModel';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

@injectable()
class Auth {
  private jwt: IJwt;

  constructor(@inject(INTERFACE_TYPES.jwt) jwt: IJwt) {
    this.jwt = jwt;
  }

  public Auth(allowedRoles: string[]) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
console.log('editttt')
        const{email,role}= JSON.parse(req.headers['user'] as string)
   
        if (!role || !allowedRoles.includes(role)) {
          res.status(403).json({ message: 'Forbidden: Insufficient permissions', errorType: 'FORBIDDEN' });
          return;
        }
    let user=null
          if(role === 'project manager') {
            user = await UserModel.findOne({ email });
          } else if (role === 'employee') {
            user = await EmployeeModel.findOne({ email });
          }
          
          if (!user) {
            res.status(404).json({ message: 'User not found' });
            return 
          }
          
          if (user.isBlock === true) {
            res.status(403).json({ message: 'Forbidden: Blocked by admin', errorType: 'BLOCKED' });
            return 
          }
  next()
      } catch (error) {
        console.error('Error during token verification:', error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
    };
  }
}

export default Auth;
