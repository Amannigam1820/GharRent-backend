import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import {
  deleteUsers,
  getUser,
  getUsers,
  profilePosts,
  savePost,
  updateUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/search/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUsers);
router.delete("/:id", verifyToken, deleteUsers);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);

export default router;
