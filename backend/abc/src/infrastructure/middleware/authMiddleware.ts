import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import IJwt from '../interfaces/IJwt';
import INTERFACE_TYPES from '../constants/inversify';

@injectable()
class RoleChecker {
  private jwt: IJwt;

  constructor(@inject(INTERFACE_TYPES.jwt) jwt: IJwt) {
    this.jwt = jwt;
  }

  public checkRole(allowedRoles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.jwt; // Get the JWT from cookies
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      try {
        const decoded = await this.jwt.verifyToken(token);
        
        if (!decoded.role || !allowedRoles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        // Attach decoded user data to the request object
        req.user = decoded; // Ensure you've extended the Request interface to include user
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    };
  }
}

export default RoleChecker;
