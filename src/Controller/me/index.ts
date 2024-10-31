import { ApiError } from "@src/utils/ApiError";
import { prisma } from "@src/utils/prisma";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

// Extend the Request interface to include the user property
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

class MeController {
  async editProfile(req: Request, res: Response): Promise<Response> {
    try {
      const { firstName, lastName, middleName } = req.body;

      if (!req.user?.email) {
        return res.status(404).json({ message: "User not found" });
      }

      const model:any = req.user.role === "Customer" ? prisma.customer : prisma.freelancer;

      const user = await model.findFirst({
        where: { email: req.user.email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let updatedData: Record<string, any> = { firstName, lastName, middleName };
      let avatar;

      // Handle avatar upload
      if (req.files?.avatar && req.files.avatar[0]) {
        const avatarPath = `/${req.files.avatar[0].originalname}`;
        const filePath = path.join("public", avatarPath);

        // Ensure the directory exists
        const directory = path.dirname(filePath);
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }

        // Save the file
        fs.writeFileSync(filePath, req.files.avatar[0].buffer);

        avatar = {
          Avatar: {
            create: {
              image: filePath,
            },
          },
        };
      }

      const updatedUser = await model.update({
        where: { email: req.user.email },
        data: { ...updatedData, ...avatar },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user?.email) {
        return res.status(404).json({ message: "User not found" });
      }

      const model:any = req.user.role === "Customer" ? prisma.customer : prisma.freelancer;

      const user = await model.findFirst({
        where: { email: req.user.email },
        include: { Avatar: {
          select:{
            image: true
          }
        } },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error getting profile:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export const meController = new MeController();