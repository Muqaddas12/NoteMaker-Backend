import User from "../models/user.mjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendMail.mjs";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const signup = async (req, res) => {
  const { name, dob, email } = req.body;

  if (!name || !dob || !email) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    let user = await User.findOne({ email });
    const otp = generateOTP();

    if (!user) {
      user = new User({ name, dob, email, otp });
    } else {
      user.name = name;
      user.dob = dob;
      user.otp = otp;
      user.isVerified = false;
    }

    await user.save();
    await sendOTP(email, otp);

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};



export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};