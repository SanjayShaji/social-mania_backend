import express from 'express';
import { blockUser, getUsers, getUser, getReportedPosts, blockPost } from '../../controllers/admin/users.js';
import { verifyToken } from "../../middlewares/admin/auth.js";

const router = express.Router();

router.get('/users-list', verifyToken, getUsers);
router.get('/user/:id', verifyToken, getUser);
router.get('/reported-posts', verifyToken, getReportedPosts);
router.patch('/post-block/:id', verifyToken, blockPost)
router.patch('/user-block/:id', verifyToken, blockUser)

export default router; 