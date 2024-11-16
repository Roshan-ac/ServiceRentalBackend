"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meController = void 0;
const prisma_1 = require("@src/utils/prisma");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class MeController {
    async editProfile(req, res) {
        try {
            const { firstName, lastName, middleName } = req.body;
            if (!req.user?.email) {
                return res.status(404).json({ message: "User not found" });
            }
            const model = req.user.role === "Customer" ? prisma_1.prisma.customer : prisma_1.prisma.freelancer;
            const user = await model.findFirst({
                where: { email: req.user.email },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            let updatedData = { firstName, lastName, middleName };
            let avatar;
            // Handle avatar upload
            if (req.files?.avatar && req.files.avatar[0]) {
                const avatarPath = `/${req.files.avatar[0].originalname}`;
                const filePath = path_1.default.join("public", avatarPath);
                // Ensure the directory exists
                const directory = path_1.default.dirname(filePath);
                if (!fs_1.default.existsSync(directory)) {
                    fs_1.default.mkdirSync(directory, { recursive: true });
                }
                // Save the file
                fs_1.default.writeFileSync(filePath, req.files.avatar[0].buffer);
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
        }
        catch (error) {
            console.error("Error updating profile:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.user?.email) {
                return res.status(404).json({ message: "User not found" });
            }
            const model = req.user.role === "Customer" ? prisma_1.prisma.customer : prisma_1.prisma.freelancer;
            const user = await model.findFirst({
                where: { email: req.user.email },
                include: { Avatar: {
                        select: {
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
        }
        catch (error) {
            console.error("Error getting profile:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
exports.meController = new MeController();
//# sourceMappingURL=index.js.map