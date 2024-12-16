import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

function authMiddleware(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    try {
      console.log( process.env.JWT_SECRET)
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!); 

      if (!decoded.role || !allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
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

export default authMiddleware;