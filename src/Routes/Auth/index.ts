import { register } from "@src/Controller/Auth";
import { asyncHandler } from "@src/Middleware/asyncHandler";
import { Router } from "express";
const router = Router();

router.post("/register", asyncHandler(register));

export default router;
