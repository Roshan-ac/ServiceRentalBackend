"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_1 = require("@src/Controller/post");
const asyncHandler_1 = require("@src/Middleware/asyncHandler");
const authorize_1 = require("@src/Middleware/authorize");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/addPost", authorize_1.authorizeMe, (0, asyncHandler_1.asyncHandler)(post_1.postController.addNewPost));
router.get("/getMyPosts", authorize_1.authorizeMe, (0, asyncHandler_1.asyncHandler)(post_1.postController.getMyPosts));
exports.default = router;
//# sourceMappingURL=index.js.map