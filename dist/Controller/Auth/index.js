"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../../utils/ApiError");
const prisma_1 = require("@src/utils/prisma");
const jwt_1 = require("@src/utils/jwt");
const UserRole = zod_1.z.enum(["Freelancer", "Customer"], {
    errorMap: () => ({
        message: "Role must be either 'Freelancer' or 'Customer'",
    }),
});
const registerSchema = zod_1.z.object({
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
    firstName: zod_1.z
        .string({
        required_error: "First name is required",
    })
        .min(1, "First name cannot be empty")
        .max(10, "First name cannot exceed 10 characters")
        .trim(),
    lastName: zod_1.z
        .string({
        required_error: "Last name is required",
    })
        .min(1, "Last name cannot be empty")
        .max(10, "Last name cannot exceed 10 characters")
        .trim(),
    middleName: zod_1.z
        .string()
        .max(10, "Middle name cannot exceed 10 characters")
        .trim()
        .optional(),
    userName: zod_1.z
        .string({
        required_error: "UserName is required",
    })
        .min(1, "UserName cannot be empty")
        .max(10, "UserName cannot exceed 10 characters")
        .trim(),
    role: UserRole,
});
const register = async (req, res) => {
    const validatedData = registerSchema.parse(req.body);
    // Check if email exists
    const existingEmail = (await prisma_1.prisma.customer.findUnique({
        where: { email: validatedData.email },
    })) ||
        (await prisma_1.prisma.freelancer.findUnique({
            where: { email: validatedData.email },
        }));
    if (existingEmail) {
        throw new ApiError_1.ApiError(400, "Email already exists");
    }
    // Check if username exists
    const existingUsername = (await prisma_1.prisma.customer.findUnique({
        where: { username: validatedData.userName },
    })) ||
        (await prisma_1.prisma.freelancer.findUnique({
            where: { username: validatedData.userName },
        }));
    if (existingUsername) {
        throw new ApiError_1.ApiError(400, "Username already exists");
    }
    try {
        if (validatedData.role === "Customer") {
            const customer = await prisma_1.prisma.customer.create({
                data: {
                    email: validatedData.email,
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                    middleName: validatedData.middleName,
                    username: validatedData.userName,
                },
            });
            const token = (0, jwt_1.generateToken)({
                email: customer.email,
                id: customer.id,
                role: "Customer",
            });
            const updateSession = await prisma_1.prisma.session.create({
                data: {
                    customerId: customer.id,
                    token,
                    expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
                select: {
                    token: true,
                    expireDate: true,
                },
            });
            return res.status(201).json({
                success: true,
                message: "Customer registered successfully",
                data: { ...customer, updateSession },
            });
        }
        const freelancer = await prisma_1.prisma.freelancer.create({
            data: {
                email: validatedData.email,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                middleName: validatedData.middleName,
                username: validatedData.userName,
            },
        });
        const token = (0, jwt_1.generateToken)({
            email: freelancer.email,
            id: freelancer.id,
            role: "Freelancer",
        });
        const updateSession = await prisma_1.prisma.session.create({
            data: {
                freelancerId: freelancer.id,
                token,
                expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            select: {
                token: true,
                expireDate: true,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Freelancer registered successfully",
            data: { ...freelancer, updateSession },
        });
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Error creating user", [error]);
    }
};
exports.register = register;
//# sourceMappingURL=index.js.map