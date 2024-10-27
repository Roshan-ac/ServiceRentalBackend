import { register } from "@src/Controller/Auth";
import { sendOTPController, verifyOTPController } from "@src/Controller/Otp";
import { asyncHandler } from "@src/Middleware/asyncHandler";
import { Router } from "express";
const router = Router();

router.post("/register", asyncHandler(register));
router.post("/sendOtp", asyncHandler(sendOTPController));
router.post("/verifyOtp", asyncHandler(verifyOTPController));

export default router;
