import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { CustomError } from '../Interfaces/types';
import { CONFIG } from '../config';
import { ZodError } from 'zod';
import { formatZodError } from '../utils/ValidationError';

// Ensure correct typing of the middleware
const errorHandler: ErrorRequestHandler = async (
  err: CustomError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (res.headersSent) {
      return next(err); // Pass to default error handler if headers already sent
    }

    if (err instanceof ZodError) {
    
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formatZodError(err),
        code: 'VALIDATION_ERROR',
      });
      return; // Ensure we don't call `next()` after sending a response
    }

    const statusCode: number = (err as CustomError).statusCode || 500;
    console.error(err);
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal server error',
      code: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
      ...(CONFIG.NODE_ENV === 'development' && { stack: err.stack }),
    });
  } catch (error) {
    next(error); // Handle unexpected errors gracefully
  }
};

export { errorHandler };