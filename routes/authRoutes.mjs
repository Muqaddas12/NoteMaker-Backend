// routes/authRoutes.js
import express from "express";
import { signup, verifyOtp } from "../controllers/authController.mjs";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);

export default router;
