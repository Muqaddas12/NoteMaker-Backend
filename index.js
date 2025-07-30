import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import noteRoutes from "./routes/noteRoutes.mjs";

dotenv.config();
const app = express();

// MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: true, 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Test root
app.get("/", (req, res) => res.send("API is running..."));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
