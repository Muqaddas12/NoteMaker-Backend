import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: `NoteMaker <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for NoteMaker",
    html: `<p>Your OTP is: <b>${otp}</b></p>`,
  };

  return transporter.sendMail(mailOptions);
};
