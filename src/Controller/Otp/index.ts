// Utility function to generate unique session ID
import { asyncHandler } from "@src/Middleware/asyncHandler";
import { ApiError } from "@src/utils/ApiError";
import { EmailVerification } from "@src/utils/emailOtpMailer";
import { prisma } from "@src/utils/prisma";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

const generateSessionId = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

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

// Utility function to generate OTP
const generateOTP = (): string => {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
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
    console.error("OTP Cleanup Error:", error);
  }
};

// Send OTP controller
export const sendOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const validatedData = OtpSchema.parse(req.body);

  if (!validatedData.email) {
    throw new ApiError(400, "Email is required");
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validatedData.email);

  if (!isEmailValid) {
    throw new ApiError(400, "Invalid email address");
  }

  try {
    // Delete any existing unused OTPs for this email
    await prisma.otp.deleteMany({
      where: {
        email:validatedData.email,
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
        email:validatedData.email,
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
    console.error("OTP Generation Error:", error);
    throw new ApiError(500, "Failed to send OTP");
  }
};

// Verify OTP controller
export const verifyOTPController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, sessionId } = req.body;

    if (!email || !otp || !sessionId) {
      throw new ApiError(400, "Email, OTP, and session ID are required");
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmailValid) {
      throw new ApiError(400, "Invalid email address");
    }

    try {
      // Find the OTP record matching both session ID and email
      const otpRecord = await prisma.otp.findFirst({
        where: {
          email,
          otp,
          sessionId,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpRecord) {
        throw new ApiError(400, "Invalid or expired OTP");
      }

      // Clean up old OTPs
      await cleanupOTPs();

      return res.status(200).json({
        success: true,
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
