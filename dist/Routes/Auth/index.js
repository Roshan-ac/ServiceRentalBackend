"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Auth_1 = require("@src/Controller/Auth");
const Otp_1 = require("@src/Controller/Otp");
const asyncHandler_1 = require("@src/Middleware/asyncHandler");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/register", (0, asyncHandler_1.asyncHandler)(Auth_1.register));
router.post("/sendOtp", (0, asyncHandler_1.asyncHandler)(Otp_1.sendOTPController));
router.post("/verifyOtp", (0, asyncHandler_1.asyncHandler)(Otp_1.verifyOTPController));
exports.default = router;
//# sourceMappingURL=index.js.map