import express from "express";
import {
  sendOtp,
  signin,
  logout,
  check,
  checkUserExists
} from "../controllers/authController.mjs";

const router = express.Router();

// 🔁 Unified OTP endpoint (for signup and signin)
router.post("/auth/send-otp", sendOtp);

// ✅ Sign in with OTP
router.post("/auth/signin", signin);

// ✅ Check if user is logged in
router.get("/auth/check", check);

// ✅ Log out
router.post("/auth/logout", logout);

// ✅ Check if user exists (optional utility)
router.post("/auth/check-user", checkUserExists);



export default router;
