import { ErrorResponse } from '@src/Interfaces/ResponseInterface';
import { NextFunction, Request, Response } from 'express';


export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(500).json({
    code: statusCode,
    message: err.message,
    details: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}