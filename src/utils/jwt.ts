import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

// Secret key (use an environment variable in production)
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Generates a JWT token.
 * @param payload - The data to encode in the JWT token.
 * @param expiresIn - Optional token expiration time (default is 1 hour).
 * @returns The generated JWT token.
 */
export const generateToken = (
  payload: object,
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn:"30d" });
};

/**
 * Verifies a JWT token.
 * @param token - The JWT token to verify.
 * @returns The decoded payload if the token is valid.
 * @throws An error if the token is invalid or expired.
 */
export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};