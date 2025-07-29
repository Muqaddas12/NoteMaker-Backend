// routes/authRoutes.js
import express from "express";
import { signup, verifyOtp,signin  } from "../controllers/authController.mjs";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/signin", signin);
export default router;
