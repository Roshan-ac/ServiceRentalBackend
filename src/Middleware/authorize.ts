import { verifyToken } from '@src/utils/jwt';
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the user property
declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

// Use environment variable for secret key
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to authenticate and decode JWT token.
 */
export const authorizeMe = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Check if token is provided in the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as JwtPayload;

    // Attach decoded payload to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};