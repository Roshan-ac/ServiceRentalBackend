import { meController } from "@src/Controller/me";
import { postController } from "@src/Controller/post";
import { asyncHandler } from "@src/Middleware/asyncHandler";
import { authorizeMe } from "@src/Middleware/authorize";
import { Fileupload } from "@src/utils/MulterUpload";
import { Router } from "express";
const router = Router();

router.post("/addPost", authorizeMe, asyncHandler(postController.addNewPost));
router.get(
  "/getMyPosts",
  authorizeMe,
  asyncHandler(postController.getMyPosts)
);

export default router;
