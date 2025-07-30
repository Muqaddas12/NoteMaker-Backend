import express from "express";
import { signup, signin, logout, check } from "../controllers/authController.mjs";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/check", check);
export default router;
//auth/check