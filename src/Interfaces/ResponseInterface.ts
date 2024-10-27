export interface ErrorResponse {
    code: number; // Error code
    message: string; // Error message
    details?: any; // Additional details or stack trace
  }