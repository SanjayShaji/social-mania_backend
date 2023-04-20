import Post from "../../models/Post.js"
import User from "../../models/User.js";
import { Comment } from "../../models/Comment.js"
import { v2 as cloudinary } from 'cloudinary'
import { v4 } from 'uuid'
import dotenv from "dotenv";
dotenv.config();

const uuid = v4();

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    secure: true
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
    folder: 'project/posts',
    public_id: new Date() + '_' + uuid
};

export const createPost = async (req, res) => {
    try {
        console.log("reacheddd");
        console.log(req.body);
        const { userId, description } = req.body;
        console.log("req.file");
        console.log(req.file);
        console.log("req.file");
        let result = await cloudinary.uploader.upload(req.file.path, opts)

        console.log("result")
        console.log(result)
        console.log("result")

        // const user = await User.findById(userId);
        const newPost = new Post({
            poster: userId,
            files: result.url,
            content: description,
        });

        const addedPost = await newPost.save();
        console.log("addedPost")
        console.log(addedPost)
        console.log("addedPost")
        // const post = await Post.findById(addedPost._id).populate("poster", "-password")
        const post = await Post.find().populate("poster", "-password").skip(0).limit(3).
            populate("poster", "-password").sort('-createdAt').lean();
        res.status(202).json(post);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}



export const getPosts = async (req, res) => {
    try {
        console.log("reacheddd");
        // console.log(req.body)
        console.log(req.query)
        const limit = parseInt(req.query.limit)
        console.log("reacheddd");
        const size = limit + 3
        const post = await Post.find().limit(size).
            populate("poster", "-password").sort('-createdAt').lean()
        console.log(post);
        // const count = await Post.countDocuments()
        // console.log("count");
        // console.log(count);
        // console.log("count");

        res.status(200).json({
            post: post,
            size: size
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getUserImagePosts = async(req, res)=>{
    try {
        console.log("reached post images");
        const {id} = req.params
        // console.log(req.query);
        const posts = await Post.find({poster: id, files: { $regex: /\.(jpg|jpeg|png)$/ }}).sort('-createdAt').lean();
        console.log(posts);
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
} 

// export const getPosts = async (req, res) => {
//     try {
//         console.log("reacheddd");
//         console.log(req.query)
//         const page = parseInt(req.query.currentPage)
//         const limit = parseInt(req.query.limit)
//         const skip = (page - 1) * limit;
//         console.log("reacheddd");
//         const post = await Post.find().skip(skip).limit(limit).
//             populate("poster", "-password").sort('-createdAt').lean()
//         console.log(post);
//         const count = await Post.countDocuments()
//         console.log("count");
//         console.log(count);
//         console.log("count");
//         const totalPages = Math.ceil(count / limit)
//         const currentPageNo = req.query.currentPage
//         res.status(201).json({
//             post: post,
//             totalPages: totalPages,
//             currentPage: currentPageNo
//         })
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("profile reached")
        console.log(req.query)
        const limit = parseInt(req.query.limit)
        console.log("reacheddd");
        const size = limit + 3
        const post = await Post.find({poster: userId}).limit(size).
            populate("poster", "-password").sort('-createdAt').lean()
        console.log(post);
        // const count = await Post.countDocuments()
        // console.log("count");
        // console.log(count);
        // console.log("count");

        res.status(200).json({
            post: post,
            size: size
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// export async function getPosts(req, res) {
//     try {
//         // const { userId } = req.body;
//         let { page, sortBy, author, search, liked } = req.query;
//         // console.log(req.query);
//         if (!sortBy)
//             sortBy = "-createdAt";
//         if (!page)
//             page = 1;

//         let posts = await Post.find().populate("poster", "-password").sort(sortBy).lean();
//         // console.log(posts);
//         if (author) {
//             posts = posts.filter((post) => {
//                 return post.poster._id == author;
//             });
//         }
//         // console.log(posts);
//         if (search) {
//             posts = posts.filter((post) => {
//                 post.title.toLowerCase().includes(search.toLowerCase());
//             });
//         }

//         const count = posts.length;

//         // posts = paginate(posts, 10, page);
//         // if(userId){
//         //     await setLiked(posts, userId);
//         // }
//         let post = posts;
//         return res.status(202).json(post);

//     } catch (error) {
//         console.log(error);
//     }
// }

export const likePost = async (req, res) => {
    try {
        console.log("reached");
        const { id } = req.params;
        console.log(req.body);
        const { userId } = req.body;
        console.log(id + " " + userId);
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedpost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        ).populate("poster", "-password");
        console.log(updatedpost);
        res.status(200).json(updatedpost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

export const updatePost = async (req, res) => {
    try {
        console.log("reached to edit post");
        console.log("files")
        console.log(req.files)
        console.log("files")
        console.log(req.body);
        // const { id } = req.params;
        const { userId, postId, description, imagePath } = req.body;
        console.log(userId);
        const post = await Post.findById(postId);
        // const isLiked = post.likes.get(userId);

        // if (isLiked) {
        //     post.likes.delete(userId);
        // } else {
        //     post.likes.set(userId, true);
        // }

        let result = await cloudinary.uploader.upload(req.file.path, opts)


        // let files = req.files;
        // let file = files.map((file) => {
        //     return file;
        // });
        // let fileName = file.map((file) => {
        //     return file.filename;
        // });

        // console.log(fileName);

        if (!imagePath) {
            fileName = post.images[0]
        }
        const updatedpost = await Post.findByIdAndUpdate(
            postId,
            {
                content: description,
                edited: true,
                files: result.url,

            },
            { new: true }
        ).populate("poster", "-password");
        console.log(updatedpost);
        res.status(200).json(updatedpost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const reportPost = async (req, res) => {
    try {
        console.log("reached to report post");
        console.log(req.body);
        const { userId, postId, content } = req.body;
        console.log(userId);
        // const update = {}
        // const existingReport = await Post.findOne({
        //     _id: postId,
        //     report: {
        //         $elemMatch: {
        //             user: userId,
        //             [content]: { $exists: true }
        //         }
        //     }
        // })
        // console.log(existingReport);
        // if (existingReport) return res.status(400).json({ msg: "User has already reported this post for this reason" });
        const update = {}

        update[`report.0.${content}`] = userId

        console.log(update);
        const updatedpost = await Post.findOneAndUpdate(
            { _id: postId },
            { $addToSet: update },
            { new: true }
        ).populate("poster", "-password");
        // if(updatedpost == null) return res.status(204).json({msg: })
        console.log(updatedpost);
        res.status(200).json(updatedpost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        // const post = await Post.deleteOne({ _id: id, poster: userId });
        const post = await Post.findById(id);
        console.log(post)
        await post.remove();
        if (post.deletedCount === 0) throw new Error("Post not found");
        console.log("deleted successfully")
        const posts = await Post.find().populate("poster", "-password").sort('-createdAt').lean();
        console.log("posts")
        console.log(posts)
        console.log("posts")
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

export const postComment = async (req, res) => {
    try {
        console.log("heyyy reached");
        const { comment, postId, userId } = req.body;
        console.log(req.body);
        let user = await User.findById(userId).select('-password')

        const postComment = await new Comment({
            comment: comment,
            post: postId,
            user: userId,
        }).save();

        // await postComment.save();

        // let pComment = postComment
        postComment.user = user
        console.log("postComment");
        console.log(postComment);
        console.log("postComment");
        res.status(200).json(postComment)
    } catch (error) {
        res.status(400).json({ message: error.mssage })

    }
}



export const getPostComments = async (req, res) => {
    try {
        console.log("reached");
        const { postId } = req.params;
        console.log(postId);
        const comments = await Comment.find({ post: postId, parentComment: {$exists: false}}).populate('user', '-password').sort('-createdAt').lean()

        console.log(comments);
        res.status(200).json(comments)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getReplyComments = async (req, res) => {
    try {
        const { parentId } = req.params;
        console.log(parentId);
        const replyComments = await Comment.find({ parentComment: parentId }).populate('replies').populate('user', '-password').sort('-createdAt').lean()
        console.log(replyComments);

        res.status(200).json(replyComments);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const replyComment = async (req, res) => {
    try {
        const { postId, parentId, reply, userId } = req.body;
        console.log(req.body);
        let user = await User.findById(userId).select('-password')
        const replyComment = new Comment({
            comment: reply,
            parentComment: parentId,
            post: postId,
            user: userId
        })
        await replyComment.save();
        replyComment.user = user;
        console.log(replyComment);

        let commentUpdate = await Comment.findOneAndUpdate(
            {_id : parentId},
            {$push: {replies: replyComment._id}},
            { new: true}
        )
        res.status(200).json(replyComment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const deleteComment = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(id)
        const { postId, userId } = req.body;
        console.log('postId');
        console.log(postId);
        console.log('postId');
        // const post = await Post.deleteOne({ _id: id, poster: userId });
        let comment = await Comment.findById(id);
        let replyComment = await Comment.findOne({ parentComment: id })
        console.log("comment")
        console.log(comment)
        console.log("comment")
        console.log("replyComment");
        console.log(replyComment);
        console.log("replyComment");
        
        while (replyComment) {
            console.log("reached");
            let current = id;
            while (current) {
                console.log("reached in current");
                let com = await Comment.findOne({ parentComment: current })
                if (com == null) {
                    await Comment.deleteOne({ _id: id });
                    break;
                }
                current = com._id;
                await Comment.deleteOne({ _id: com._id })
            }
            replyComment = await Comment.findOne({ parentComment: id })
            console.log(replyComment)
        }

        let commentDelete = await Comment.deleteOne({ _id: id });
        console.log("commentDelete");
        console.log(commentDelete);
        console.log("commentDelete");

        if (commentDelete.deletedCount === 0 ) throw new Error("Comment not found");
        console.log("deleted successfully")
        let comments = '';
        // if (commentDelete.deletedCount === 0) {
        //     comments = await ReplyComment.find({ post: postId }).populate('user', '-password').sort('-createdAt').lean();
        // } else {
        //     comments = await Comment.find({ post: postId }).populate('user', '-password').sort('-createdAt').lean();
        // }
        // console.log("comments");
        // console.log(comments);
        // console.log("comments");
        let commentsData = await Comment.find({ post: postId, parentComment: {$exists: false}}).populate('user', '-password').sort('-createdAt').lean()

        res.status(200).json(commentsData);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}