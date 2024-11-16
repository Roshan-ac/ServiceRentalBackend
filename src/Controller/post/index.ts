import { prisma } from "@src/utils/prisma";
import { Request, Response } from "express";
import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      files?: {
        avatar?: {
          originalname: string;
          buffer: Buffer;
        }[];
      };
    }
  }
}

type PaymentMode = "DAILY" | "FIXED";

const postSchemma = z.object({
  caption: z
    .string()
    .min(1, "Caption is required")
    .regex(/^[a-zA-Z\s]*$/, "Location must be Valid"),
  location: z
    .string()
    .min(1, "Location is required")
    .regex(/^[a-zA-Z\s]*$/, "Location must be Valid"),
  estimatedTime: z.string().min(1, { message: "Time must be greater than 0." }),
  paymentMethod: z.enum(["DAILY", "FIXED"]),
  dailyRate: z
    .number()
    .optional()
    .refine((val) => !val || val > 0, {
      message: "Daily rate must be a positive number.",
    }),
  fixedRate: z
    .number()
    .optional()
    .refine((val) => !val || val > 0, {
      message: "Fixed rate must be a positive number.",
    }),
  skills: z
    .array(z.string())
    .min(1, { message: "Please enter at least one skill." }),
  description: z
    .string()
    .max(250, "Description must be 250 characters or less"),
});

class PostController {
  public async addNewPost(req: Request, res: Response) {
    console.log( await req.body);
    console.log( "hello world");

    if (typeof req.body === "string") {
      req.body = JSON.parse( req.body);
    }

    const validatedData = postSchemma.parse(req.body);
    const {
      caption,
      location,
      estimatedTime,
      dailyRate,
      fixedRate,
      skills,
      paymentMethod,
      description,
    } = validatedData;

    const role = req.user?.role;
    if (!role || role !== "Customer") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(req.user?.id);

    // Save the post to the database
    const post = await prisma.post.create({
      data: {
        caption,
        location,
        estimatedTime: parseInt(estimatedTime),
        paymentMode: paymentMethod as PaymentMode,
        ...(dailyRate && { dailyRate: dailyRate }),
        ...(fixedRate && { hourlyRate: fixedRate }),
        requiredSkills: skills,
        customerId: req.user?.id ?? "",
        description,
      },
    });

    return res.status(201).json({ message: "Post created successfully", post });
  }

    public async getMyPosts(req: Request, res: Response) {
        const role = req.user?.role;
        if (!role || role !== "Customer") {
        return res.status(401).json({ message: "Unauthorized" });
        }
    
        const posts = await prisma.post.findMany({
        where: { customerId: req.user?.id },
        select:{
            caption:true,
            location:true,
            estimatedTime:true,
            paymentMode:true,
            dailyRate:true,
            fixedRate:true,
            postedAt:true,
            requiredSkills:true,
            description:true,
        }
        });
    
        return res.status(200).json({ posts });
    }
}

export const postController = new PostController();
