import jwt from 'jsonwebtoken';

// JWT authentication middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// Centralized error handler for database/application errors
export const handleError = (res, error, status = 500) => {
  console.error('[Database Error]', {
    code: error.code,
    message: error.message,
    detail: error.detail,
    timestamp: new Date().toISOString()
  });

  let message = 'An error occurred';
  let clientStatus = status;

  if (error.code === '23505') {
    message = 'This email is already registered';
    clientStatus = 409;
  } else if (error.code === '23503') {
    message = 'Invalid reference: restaurant or user not found';
    clientStatus = 400;
  } else if (error.code === '23502') {
    message = 'Missing required field';
    clientStatus = 400;
  } else if (error.code === '42P01') {
    message = 'Database table not found';
    clientStatus = 500;
  } else if (error.code === '42703') {
    message = 'Database column not found - migration may be needed';
    clientStatus = 500;
  } else if (error.message?.includes('UNIQUE constraint')) {
    message = 'Duplicate entry';
    clientStatus = 409;
  }

  res.status(clientStatus).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { debug: error.message })
  });
};
