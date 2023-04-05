import express from 'express'
import { createChat, findChat, userChats } from '../../controllers/user/chat.js';
import { verifyToken } from "../../middlewares/user/auth.js";

const router = express.Router();

router.post("/", verifyToken, createChat)
router.get("/:userId", verifyToken, userChats)
router.get("/find/:firstId/:secondId", verifyToken, findChat)

export default router
 