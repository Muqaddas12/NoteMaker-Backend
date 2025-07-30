// ✅ Updated backend controller (authController.mjs)
import User from "../models/user.mjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendMail.mjs";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const RATE_LIMIT_DURATION = 60 * 1000;
const OTP_EXPIRY = 10 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000;

export const sendOtp = async (req, res) => {
  const { name, dob, email } = req.body;

  if (!name || !dob || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let user = await User.findOne({ email });
    const now = new Date();

    if (user && user.isVerified) {
      return res.status(400).json({ error: "User already exists. Please sign in." });
    }

    if (user) {
      if (now - (user.otpRequestedAt || 0) < RATE_LIMIT_DURATION) {
        return res.status(429).json({ error: "Please wait before requesting a new OTP" });
      }

      const otp = generateOTP();
      user.name = name;
      user.dob = dob;
      user.otp = otp;
      user.otpRequestedAt = now;
      user.otpExpiresAt = new Date(now.getTime() + OTP_EXPIRY);
      user.isVerified = false;

      await user.save();
      await sendOTP(email, otp);
      return res.status(200).json({ message: "OTP resent to your email" });
    }

    const otp = generateOTP();
    const newUser = new User({
      name,
      dob,
      email,
      otp,
      otpRequestedAt: now,
      otpExpiresAt: new Date(now.getTime() + OTP_EXPIRY),
      isVerified: false,
    });

    await newUser.save();
    await sendOTP(email, otp);
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


