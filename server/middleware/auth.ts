import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string | number;
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header
 * Attaches user info to request object
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required',
      code: 'UNAUTHORIZED',
      statusCode: 401,
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'FORBIDDEN',
        statusCode: 403,
      });
      return;
    }
    req.userId = user.id;
    req.user = user;
    next();
  });
};

/**
 * Generate JWT Token
 * @param userId - User ID to encode in token
 * @param expiresIn - Token expiration time (default: 24h)
 */
export const generateToken = (
  userId: string | number,
  expiresIn?: string
): string => {
  const payload: any = {
    id: userId,
  };
  
  const options: any = {};
  if (expiresIn) {
    options.expiresIn = expiresIn;
  } else {
    options.expiresIn = '24h';
  }
  
  return jwt.sign(payload, JWT_SECRET, options) as string;
};

/**
 * Verify JWT Token
 * @param token - JWT token to verify
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Decode JWT Token (without verification)
 * @param token - JWT token to decode
 */
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

export default authenticateToken;
