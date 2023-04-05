import express from "express";
import multer from "multer";
import {
    getUser,
    getUserFriends,
    getSearchUsers,
    friendRequest,
    acceptRejectFriendRequest,
    getUserFriendRequests,
    removeFriend,
    getUsers,
    uploadProfile,
    uploadCover
} from "../../controllers/user/users.js";
import {coverUpload, profileUpload} from "../../public/multer.js"

import { verifyToken } from "../../middlewares/user/auth.js";
const router = express.Router();

const upload = multer({dest: 'project/users/'})

//read
router.get("/:id",verifyToken, getUser);
router.get("/",verifyToken, getUsers);
router.get("/search/:searchName",verifyToken, getSearchUsers)
router.get("/:id/friends",verifyToken, getUserFriends);

//update
router.patch('/friend-request/:id',verifyToken, friendRequest);
router.patch('/accept-reject-friend-request/:id',verifyToken, acceptRejectFriendRequest);
router.patch('/remove-friend/:id',verifyToken, removeFriend);
router.post('/friend-requests',verifyToken, getUserFriendRequests) ;
router.post('/profile',verifyToken, upload.single('profileImage'), uploadProfile)
router.post('/cover',verifyToken, upload.single('coverImage'), uploadCover)

export default router; 
