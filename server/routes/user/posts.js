import express from "express";
const router = express.Router();
import {createPost, updatePost, reportPost, getUserImagePosts, getPostComments, getPosts, getReplyComments, deleteComment, getUserPosts, likePost, postComment, replyComment, deletePost} from "../../controllers/user/posts.js"
import { verifyToken } from "../../middlewares/user/auth.js";
import {postUpload} from "../../public/multer.js"
// import {uploadImage, uploadMultipleImages} from '../../public/uploadImage.js'
import multer from "multer";

const upload = multer({ dest: 'project/posts/'})

router.get('/',verifyToken, getPosts)
router.get('/:userId',verifyToken, getUserPosts)
router.get('/:id/images',verifyToken, getUserImagePosts)
// router.post('/', postUpload.array('image'), createPost)
router.post('/', verifyToken, upload.single('file'), createPost)
router.patch('/like/:id',verifyToken, likePost);
router.post('/update',verifyToken, upload.single('image'), updatePost)
router.post('/report', verifyToken, upload.none(), reportPost)
router.delete('/remove/:id', verifyToken, deletePost)
router.get('/comments/:postId', verifyToken,getPostComments);
router.post('/comment',verifyToken, postComment );
router.get('/comment/reply/:parentId', verifyToken, getReplyComments)
router.post('/comment/reply',verifyToken, replyComment)
router.delete('/comment/delete/:id',verifyToken, deleteComment)
  
export default router;
