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
router.post("/send-otp", sendOtp);

// ✅ Sign in with OTP
router.post("/signin", signin);

// ✅ Check if user is logged in
router.get("/check", check);

// ✅ Log out
router.post("/logout", logout);

// ✅ Check if user exists (optional utility)
router.post("/check-user", checkUserExists);



export default router;
