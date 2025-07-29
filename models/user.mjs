import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  dob: String,
  email: { type: String, required: true, unique: true },
  otp: String,
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
export default User;
