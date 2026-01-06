import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string | number;
  user?: JwtPayload | any;
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
    const decodedUser = user as JwtPayload;
    req.userId = (decodedUser as any).id;
    req.user = decodedUser;
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
  expiresIn = '24h'
): string => {
  return jwt.sign(
    {
      id: userId,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Verify JWT Token
 * @param token - JWT token to verify
 */
export const verifyToken = (token: string): JwtPayload | string => {
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
export const decodeToken = (token: string): JwtPayload | null => {
  return jwt.decode(token);
};

export default authenticateToken;
