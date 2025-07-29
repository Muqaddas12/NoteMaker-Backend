
import express from "express";
import protect from "../middleware/authMiddleware.mjs";

const router = express.Router();

// Example protected route
router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

export default router;
