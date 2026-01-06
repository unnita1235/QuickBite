/**
 * Error handling middleware for Express application
 * Catches and formats errors for consistent API responses
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Default error status and message
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Handle validation errors from express-validator
  if (err.array && typeof err.array === 'function') {
    status = 400;
    message = 'Validation Error';
    errors = err.array();
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Handle database errors
  if (err.code === 'ECONNREFUSED') {
    status = 503;
    message = 'Database connection failed';
  }

  if (err.code === '23505') { // PostgreSQL unique constraint violation
    status = 409;
    message = 'Duplicate entry';
  }

  // Send error response
  res.status(status).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
