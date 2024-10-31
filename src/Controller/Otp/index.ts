// Utility function to generate unique session ID

import { EmailVerification } from "@src/utils/emailOtpMailer";
// Verify OTP controller
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { ApiError } from "@src/utils/ApiError";
import { generateToken } from "@src/utils/jwt";
import { asyncHandler } from "@src/Middleware/asyncHandler";
import { prisma } from "@src/utils/prisma";

// Utility function to generate unique session ID
const generateSessionId = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Improved OTP schema with email validation
const OtpSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .refine((email) => {
      const validDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
      ];
      const domain = email.split("@")[1];
      return validDomains.includes(domain);
    }, "Email domain not allowed. Use gmail.com, yahoo.com, hotmail.com, or outlook.com"),
});

// Improved OTP verification schema
const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
  sessionId: z.string().min(1, "Session ID is required"),
});

// Improved OTP generation function with guaranteed 6 digits
const generateOTP = (): string => {
  // Generate a random number between 100000 and 999999 (inclusive)
  const min = 100000;
  const max = 999999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
};

// Cleanup function for expired/used OTPs
const cleanupOTPs = async () => {
  try {
    await prisma.otp.deleteMany({
      where: {
        expiresAt: { lte: new Date() },
      },
    });
  } catch (error) {
    throw new ApiError(500, "Failed to clean up expired OTPs");
  }
};

// Send OTP controller
export const sendOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedData = OtpSchema.parse(req.body);

  // Generate new OTP and session ID
  const otp = generateOTP();
  const sessionId = generateSessionId();

  // Calculate expiry (10 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // Create new OTP record with session ID
  await prisma.otp.create({
    data: {
      email: validatedData.email,
      otp,
      sessionId,
      expiresAt,
    },
  });

  try {
    // Delete any existing unused OTPs for this email
    await prisma.otp.deleteMany({
      where: {
        email: validatedData.email,
      },
    });

    // Generate new OTP and session ID
    const otp = generateOTP();
    const sessionId = generateSessionId();

    // Calculate expiry (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Create new OTP record with session ID
    await prisma.otp.create({
      data: {
        email: validatedData.email,
        otp,
        sessionId,
        expiresAt,
      },
    });

    // Send email with OTP
    await EmailVerification(validatedData.email, Number(otp));

    // Return only the session ID to the client
    res.status(200).json({
      success: true,
      sessionId,
      message: "OTP sent successfully",
    });
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP");
  }
};

interface VerifyOTPBody {
  email: string;
  otp: string;
  sessionId: string;
}

const createSession = async (
  userId: string,
  email: string,
  role: "Customer" | "Freelancer"
) => {
  const token = generateToken({ email, role });
  console.log(token);

  const sessionData = {
    token,
    expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 day
  };

  return await prisma.session.update({
    data: sessionData,
    where: {
      ...(role === "Customer"
        ? { customerId: userId }
        : { freelancerId: userId }),
    },
    select: {
      token: true,
      expireDate: true,
    },
  });
};

const findUser = async (email: string) => {
  const customer = await prisma.customer.findFirst({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      middleName: true,
      session: true,
    },
  });

  if (customer) {
    return { user: customer, role: "Customer" as const };
  }

  const freelancer = await prisma.freelancer.findFirst({
    where: { email },
    select: {
      id: true,
      firstName: true,
      username: true,
      lastName: true,
      email: true,
      middleName: true,
      session: true,
    },
  });

  if (freelancer) {
    return { user: freelancer, role: "Freelancer" as const };
  }

  return null;
};

export const verifyOTPController = asyncHandler(
  async (
    req: Request<{}, {}, VerifyOTPBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, otp, sessionId } = req.body;
    const validatedData = VerifyOtpSchema.parse({ email, otp, sessionId });

    // Validate required fields
    if (!email || !otp || !sessionId) {
      throw new ApiError(400, "Email, OTP, and session ID are required");
    }

    // Validate email format
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      throw new ApiError(400, "Invalid email address");
    }

    try {
      // Verify OTP
      const otpRecord = await prisma.otp.findFirst({
        where: {
          email: validatedData.email,
          otp: validatedData.otp,
          sessionId: validatedData.sessionId,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpRecord) {
        throw new ApiError(400, "Invalid or expired OTP");
      }

      // Clean up expired OTPs
      await cleanupOTPs();

      // Find existing user
      const userInfo = await findUser(email);

      if (!userInfo) {
        return res.status(200).json({
          success: true,
          isRegistered: false,
          message: "OTP verified successfully",
        });
      }

      await createSession(userInfo.user.id, email, userInfo.role);

      return res.status(200).json({
        success: true,
        isRegistered: true,
        ...(await findUser(email)),
        message: "OTP verified successfully",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to verify OTP");
    }
  }
);
// Rate limiter middleware
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 requests per window per IP
  message: "Too many OTP requests. Please try again later.",
});
