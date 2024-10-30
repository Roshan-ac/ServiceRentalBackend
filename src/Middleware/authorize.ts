import { verifyToken } from "@src/utils/jwt";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authorizeMe = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authorization token missing or invalid" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as JwtPayload;

    req.user = decoded; // Attach the decoded token to the request
    next(); // Proceed to the next middleware or handler
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};