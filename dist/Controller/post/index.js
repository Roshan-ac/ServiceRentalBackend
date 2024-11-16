"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const prisma_1 = require("@src/utils/prisma");
const zod_1 = require("zod");
const postSchemma = zod_1.z.object({
    caption: zod_1.z
        .string()
        .min(1, "Caption is required")
        .regex(/^[a-zA-Z\s]*$/, "Location must be Valid"),
    location: zod_1.z
        .string()
        .min(1, "Location is required")
        .regex(/^[a-zA-Z\s]*$/, "Location must be Valid"),
    estimatedTime: zod_1.z.string().min(1, { message: "Time must be greater than 0." }),
    paymentMethod: zod_1.z.enum(["DAILY", "FIXED"]),
    dailyRate: zod_1.z
        .number()
        .optional()
        .refine((val) => !val || val > 0, {
        message: "Daily rate must be a positive number.",
    }),
    fixedRate: zod_1.z
        .number()
        .optional()
        .refine((val) => !val || val > 0, {
        message: "Fixed rate must be a positive number.",
    }),
    skills: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "Please enter at least one skill." }),
    description: zod_1.z
        .string()
        .max(250, "Description must be 250 characters or less"),
});
class PostController {
    async addNewPost(req, res) {
        console.log(await req.body);
        console.log("hello world");
        if (typeof req.body === "string") {
            req.body = JSON.parse(req.body);
        }
        const validatedData = postSchemma.parse(req.body);
        const { caption, location, estimatedTime, dailyRate, fixedRate, skills, paymentMethod, description, } = validatedData;
        const role = req.user?.role;
        if (!role || role !== "Customer") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(req.user?.id);
        // Save the post to the database
        const post = await prisma_1.prisma.post.create({
            data: {
                caption,
                location,
                estimatedTime: parseInt(estimatedTime),
                paymentMode: paymentMethod,
                ...(dailyRate && { dailyRate: dailyRate }),
                ...(fixedRate && { hourlyRate: fixedRate }),
                requiredSkills: skills,
                customerId: req.user?.id ?? "",
                description,
            },
        });
        return res.status(201).json({ message: "Post created successfully", post });
    }
    async getMyPosts(req, res) {
        const role = req.user?.role;
        if (!role || role !== "Customer") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const posts = await prisma_1.prisma.post.findMany({
            where: { customerId: req.user?.id },
            select: {
                caption: true,
                location: true,
                estimatedTime: true,
                paymentMode: true,
                dailyRate: true,
                fixedRate: true,
                postedAt: true,
                requiredSkills: true,
                description: true,
            }
        });
        return res.status(200).json({ posts });
    }
}
exports.postController = new PostController();
//# sourceMappingURL=index.js.map