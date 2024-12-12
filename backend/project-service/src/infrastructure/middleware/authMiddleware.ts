import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import IJwt from '../interfaces/IJwt';
import INTERFACE_TYPES from '../constants/inversify';

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
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
      }

      try {
        const decoded = await this.jwt.verifyToken(token);

        if (!decoded.role || !allowedRoles.includes(decoded.role)) {
          res
            .status(403)
            .json({ message: 'Forbidden: Insufficient permissions' });
          return;
        }
        req.user = decoded;
        next();
      } catch (error) {
        console.error('Error during token verification:', error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
    };
  }
}

export default Auth;
