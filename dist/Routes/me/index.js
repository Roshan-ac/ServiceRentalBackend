"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_1 = require("@src/Controller/me");
const asyncHandler_1 = require("@src/Middleware/asyncHandler");
const authorize_1 = require("@src/Middleware/authorize");
const MulterUpload_1 = require("@src/utils/MulterUpload");
const express_1 = require("express");
const router = (0, express_1.Router)();
const uploadVendorDocument = MulterUpload_1.Fileupload.fields([
    { name: "avatar", maxCount: 1 },
]);
router.post("/editProfile", authorize_1.authorizeMe, uploadVendorDocument, (0, asyncHandler_1.asyncHandler)(me_1.meController.editProfile));
router.get("/profile", authorize_1.authorizeMe, (0, asyncHandler_1.asyncHandler)(me_1.meController.getProfile));
exports.default = router;
//# sourceMappingURL=index.js.map