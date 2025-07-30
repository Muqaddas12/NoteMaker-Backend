import User from "../models/user.mjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendMail.mjs";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const RATE_LIMIT_DURATION = 60 * 1000; // 1 min
const OTP_EXPIRY = 10 * 60 * 1000; // 10 min
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000; // 15 min

//SignIn


export const sendOtp = async (req, res) => {
  const { name, dob, email,route } = req.body;

  if (!name || !dob || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const now = new Date();
    let user = await User.findOne({ email });

    // If user exists and already verified
    if (user && user.isVerified&&!route) {
            const otp = generateOTP();
             user.otp = otp;
             user.otpRequestedAt = now;
      user.otpExpiresAt = new Date(now.getTime() + OTP_EXPIRY);
      await user.save();
      await sendOTP(email, otp);
      return res.status(200).json({ message: "OTP sent to your email" });
     
    }

    // If user exists but unverified
    if (user && (!user.isVerified)) {
      if (now - (user.otpRequestedAt || 0) < RATE_LIMIT_DURATION) {
        return res.status(429).json({ error: "Please wait before requesting a new OTP" });
      }
// this is not duplicate contdition this for signup page 

      if(user.email===email){

        return res.status(400).json({ error: "User Already Exists Please SignIn" });
      }
    
      // const otp = generateOTP();
      // user.name = name; 
      // user.dob = dob;
      // user.otp = otp;
      // user.otpRequestedAt = now;
      // user.otpExpiresAt = new Date(now.getTime() + OTP_EXPIRY);
      // user.isVerified = false;

      // await user.save();
      // await sendOTP(email, otp);
      // return res.status(200).json({ message: "OTP resent to your email" });
    }

    // Create new user if not found
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



// ✅ 2. Sign In (Verify OTP)
export const signin = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const otp = req.body.otp?.trim();

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(403).json({ error: "Account locked. Try again later." });
    }

    if (user.otp !== otp) {
      user.failedOtpAttempts = (user.failedOtpAttempts || 0) + 1;

      if (user.failedOtpAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION);
      }

      await user.save();
      return res.status(401).json({ error: "Invalid OTP" });
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return res.status(401).json({ error: "OTP has expired" });
    }

    // Success
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpRequestedAt = null;
    user.failedOtpAttempts = 0;
    user.lockUntil = null;

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Signed in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ 3. Check Login (Protected Route Check)
export const check = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ loggedIn: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-otp -otpExpiresAt -otpRequestedAt");

    if (!user) {
      return res.status(401).json({ loggedIn: false, error: "Invalid token" });
    }

    res.status(200).json({
      loggedIn: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Token check error:", err);
    return res.status(401).json({ loggedIn: false, error: "Token is invalid or expired" });
  }
};

// ✅ 4. Logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// ✅ 5. Check if User Exists
export const checkUserExists = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(200).json({ exists: true, verified: true });
    } else if (user && !user.isVerified) {
      return res.status(200).json({ exists: true, verified: false });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Check user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
