import express from "express";
import { getMyProfile, login, logout, register } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me",verifyToken, getMyProfile)

export default router;
