import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { deleteUsers, getUser, getUsers, savePost, updateUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/",getUsers)
router.get("/:id",verifyToken,getUser)
router.put("/:id",verifyToken,updateUsers)
router.delete("/:id",verifyToken,deleteUsers)
router.post("/save", verifyToken,savePost)



export default router;
