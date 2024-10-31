import { meController } from "@src/Controller/me";
import { asyncHandler } from "@src/Middleware/asyncHandler";
import { authorizeMe } from "@src/Middleware/authorize";
import { Fileupload } from "@src/utils/MulterUpload";
import { Router } from "express";

const router = Router();

const uploadVendorDocument = Fileupload.fields([
  { name: "avatar", maxCount: 1 },
]);

router.post(
  "/editProfile",
  authorizeMe,
  uploadVendorDocument,
  asyncHandler(meController.editProfile)
);
router.get("/profile", authorizeMe, asyncHandler(meController.getProfile));

export default router;