import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import IJwt from '../interfaces/IJwt';
import INTERFACE_TYPES from '../constants/inversify';
import { JwtPayload } from 'jsonwebtoken';

@injectable()
class RoleChecker {
  private jwt: IJwt;

  constructor(@inject(INTERFACE_TYPES.jwt) jwt: IJwt) {
    this.jwt = jwt;
  }

  public checkRole(allowedRoles: string[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const token = req.cookies.jwt; // Get the JWT from cookies
      if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return; // Prevent further execution
      }

      try {
        const decoded = await this.jwt.verifyToken(token) as JwtPayload;

        // Role check
        if (!decoded.role || !allowedRoles.includes(decoded.role)) {
          res.status(403).json({ message: 'Forbidden' });
          return; // Prevent further execution
        }

        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware
      } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
      }
    };
  }
}

export default RoleChecker;
