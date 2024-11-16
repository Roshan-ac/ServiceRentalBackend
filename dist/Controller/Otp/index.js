"use strict";
// Utility function to generate unique session ID
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpLimiter = exports.verifyOTPController = exports.sendOTPController = void 0;
const emailOtpMailer_1 = require("@src/utils/emailOtpMailer");
const crypto_1 = __importDefault(require("crypto"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const zod_1 = require("zod");
const ApiError_1 = require("@src/utils/ApiError");
const jwt_1 = require("@src/utils/jwt");
const asyncHandler_1 = require("@src/Middleware/asyncHandler");
const prisma_1 = require("@src/utils/prisma");
// Utility function to generate unique session ID
const generateSessionId = () => {
    return crypto_1.default.randomBytes(32).toString("hex");
};
// Improved OTP schema with email validation
const OtpSchema = zod_1.z.object({
    email: zod_1.z
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
const VerifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    otp: zod_1.z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only digits"),
    sessionId: zod_1.z.string().min(1, "Session ID is required"),
});
// Improved OTP generation function with guaranteed 6 digits
const generateOTP = () => {
    // Generate a random number between 100000 and 999999 (inclusive)
    const min = 100000;
    const max = 999999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString();
};
// Cleanup function for expired/used OTPs
const cleanupOTPs = async () => {
    try {
        await prisma_1.prisma.otp.deleteMany({
            where: {
                expiresAt: { lte: new Date() },
            },
        });
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Failed to clean up expired OTPs");
    }
};
// Send OTP controller
const sendOTPController = async (req, res, next) => {
    const validatedData = OtpSchema.parse(req.body);
    // Generate new OTP and session ID
    const otp = generateOTP();
    const sessionId = generateSessionId();
    // Calculate expiry (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    // Create new OTP record with session ID
    await prisma_1.prisma.otp.create({
        data: {
            email: validatedData.email,
            otp,
            sessionId,
            expiresAt,
        },
    });
    try {
        // Delete any existing unused OTPs for this email
        await prisma_1.prisma.otp.deleteMany({
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
        await prisma_1.prisma.otp.create({
            data: {
                email: validatedData.email,
                otp,
                sessionId,
                expiresAt,
            },
        });
        // Send email with OTP
        await (0, emailOtpMailer_1.EmailVerification)(validatedData.email, Number(otp));
        // Return only the session ID to the client
        res.status(200).json({
            success: true,
            sessionId,
            message: "OTP sent successfully",
        });
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Failed to send OTP");
    }
};
exports.sendOTPController = sendOTPController;
const createSession = async (userId, email, role) => {
    const token = (0, jwt_1.generateToken)({ email, role });
    console.log(token);
    const sessionData = {
        token,
        expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 day
    };
    return await prisma_1.prisma.session.update({
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
const findUser = async (email) => {
    const customer = await prisma_1.prisma.customer.findFirst({
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
        return { user: customer, role: "Customer" };
    }
    const freelancer = await prisma_1.prisma.freelancer.findFirst({
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
        return { user: freelancer, role: "Freelancer" };
    }
    return null;
};
exports.verifyOTPController = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { email, otp, sessionId } = req.body;
    const validatedData = VerifyOtpSchema.parse({ email, otp, sessionId });
    // Validate required fields
    if (!email || !otp || !sessionId) {
        throw new ApiError_1.ApiError(400, "Email, OTP, and session ID are required");
    }
    // Validate email format
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
        throw new ApiError_1.ApiError(400, "Invalid email address");
    }
    try {
        // Verify OTP
        const otpRecord = await prisma_1.prisma.otp.findFirst({
            where: {
                email: validatedData.email,
                otp: validatedData.otp,
                sessionId: validatedData.sessionId,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otpRecord) {
            throw new ApiError_1.ApiError(400, "Invalid or expired OTP");
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
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        throw new ApiError_1.ApiError(500, "Failed to verify OTP");
    }
});
// Rate limiter middleware
exports.otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 requests per window per IP
    message: "Too many OTP requests. Please try again later.",
});
//# sourceMappingURL=index.js.map