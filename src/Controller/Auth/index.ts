import { Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "@src/utils/prisma";
import { generateToken } from "@src/utils/jwt";
import exp from "constants";

const UserRole = z.enum(["Freelancer", "Customer"], {
  errorMap: () => ({
    message: "Role must be either 'Freelancer' or 'Customer'",
  }),
});

const registerSchema = z.object({
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

  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name cannot be empty")
    .max(10, "First name cannot exceed 10 characters")
    .trim(),

  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, "Last name cannot be empty")
    .max(10, "Last name cannot exceed 10 characters")
    .trim(),

  middleName: z
    .string()
    .max(10, "Middle name cannot exceed 10 characters")
    .trim()
    .optional(),

  userName: z
    .string({
      required_error: "UserName is required",
    })
    .min(1, "UserName cannot be empty")
    .max(10, "UserName cannot exceed 10 characters")
    .trim(),

  role: UserRole,
});

export const register = async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  // Check if email exists
  const existingEmail =
    (await prisma.customer.findUnique({
      where: { email: validatedData.email },
    })) ||
    (await prisma.freelancer.findUnique({
      where: { email: validatedData.email },
    }));

  if (existingEmail) {
    throw new ApiError(400, "Email already exists");
  }

  // Check if username exists
  const existingUsername =
    (await prisma.customer.findUnique({
      where: { username: validatedData.userName },
    })) ||
    (await prisma.freelancer.findUnique({
      where: { username: validatedData.userName },
    }));

  if (existingUsername) {
    throw new ApiError(400, "Username already exists");
  }

  try {
    if (validatedData.role === "Customer") {
      const customer = await prisma.customer.create({
        data: {
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          middleName: validatedData.middleName,
          username: validatedData.userName,
        },
      });

      const token = generateToken({ email: customer.email, role: "Customer" });

      const updateSession = await prisma.session.create({
        data: {
          customerId: customer.id,
          token,
          expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        select:{
          token:true,
          expireDate:true
        }
      });

      return res.status(201).json({
        success: true,
        message: "Customer registered successfully",
        data: { ...customer, updateSession },
      });
    }

    const freelancer = await prisma.freelancer.create({
      data: {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName,
        username: validatedData.userName,
      },
    });


    const token = generateToken({
      email: freelancer.email,
      role: "Freelancer",
    });

    const updateSession = await prisma.session.create({
      data: {
        freelancerId: freelancer.id,
        token,
        expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      select:{
        token:true,
        expireDate:true
      }
    });

    return res.status(201).json({
      success: true,
      message: "Freelancer registered successfully",
      data: { freelancer, updateSession },
    });
  } catch (error) {
    throw new ApiError(500, "Error creating user", [error]);
  }
};
