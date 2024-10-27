export interface ErrorResponse {
  code: number; // Error code
  message: string; // Error message
  details?: any; // Additional details or stack trace
}

import { Request } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any[];
}

export interface AuthRequest extends Request {
  user?: any;
}