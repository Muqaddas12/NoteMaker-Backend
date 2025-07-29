// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import noteRoutes from "./routes/noteRoutes.mjs";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
