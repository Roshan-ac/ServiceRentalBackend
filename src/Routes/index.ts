import { Router } from "express";
const router = Router();
import auth from "./Auth";

router.use("/auth", auth);


export default router;
