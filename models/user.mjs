import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  dob: String,
  email: { type: String, required: true, unique: true },
  otp: String,
  otpExpiresAt: Date,
  otpRequestedAt: Date,
  isVerified: { type: Boolean, default: false },
  failedOtpAttempts: { type: Number, default: 0 },
  lockUntil: Date,
});

const User = mongoose.model("User", userSchema);
export default User;
