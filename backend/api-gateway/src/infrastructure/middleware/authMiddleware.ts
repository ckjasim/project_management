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
      res.status(401).json({ message: 'Unauthorized: No token provided', errorType: 'NO_TOKEN' });
      return;
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (!decoded.role || !allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions', errorType: 'FORBIDDEN' });
        return;
      }

      req.headers['user'] =JSON.stringify( decoded); 
      next();
    } catch (error: any) {
      console.error('Error during token verification:', error);

      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Unauthorized: Token expired', errorType: 'TOKEN_EXPIRED' });
      } else {
        res.status(401).json({ message: 'Unauthorized: Invalid token', errorType: 'INVALID_TOKEN' });
      }
    }
  };
}

export default authMiddleware;