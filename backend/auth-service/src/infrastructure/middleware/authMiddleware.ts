import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import IJwt from '../interfaces/IJwt';
import INTERFACE_TYPES from '../constants/inversify';
import { UserModel } from '../../database/model/userModel';
import { EmployeeModel } from '../../database/model/employeeModel';

declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
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
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided', errorType: 'NO_TOKEN' });
        return;
      }

      try {
        const decoded = await this.jwt.verifyToken(token);
        console.log(decoded,'rolllllllleeeeeeeeeeeeeeeeeeee')

        if (!decoded.role || !allowedRoles.includes(decoded.role)) {
          res.status(403).json({ message: 'Forbidden: Insufficient permissions', errorType: 'FORBIDDEN' });
          return;
        }
        const userEmail = decoded.email;
        let user = null;
        
        if(decoded.role==='admin'){
          req.user = decoded;
          next();
        }else{
          if(decoded.role === 'project manager') {
            user = await UserModel.findOne({ email: userEmail });
          } else if (decoded.role === 'employee') {
            user = await EmployeeModel.findOne({ email: userEmail });
          }
          
          if (!user) {
            res.status(404).json({ message: 'User not found' });
            return 
          }
          
          if (user.isBlock === true) {
            res.status(403).json({ message: 'Forbidden: Blocked by admin', errorType: 'BLOCKED' });
            return 
          }
  
          req.user = decoded;
          next();
        }
        
        
      } catch (error:any) {
        console.error('Error during token verification:', error); 
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Unauthorized: Token expired', errorType: 'TOKEN_EXPIRED' });
      } else {
        res.status(401).json({ message: 'Unauthorized: Invalid token', errorType: 'INVALID_TOKEN' });
      }
      }
    };
  }
}

export default Auth;
