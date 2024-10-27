import { ZodError } from 'zod';

interface ValidationError {
  field: string;
  message: string;
}

export const formatZodError = (error: ZodError): ValidationError[] => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
};