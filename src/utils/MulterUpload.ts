import multer from "multer";

export const Fileupload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 5MB limit
});