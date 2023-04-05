import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        required:false
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    likes:{
        type: Map,
        of: Boolean,
        default : {}
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
    ],

    edited: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
)

const ReplyCommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        required:false
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: Map,
        of: Boolean,
        default: {}
    }
},
{timestamps: true}
)


// module.exports = {
//     Comment: mongoose.model('Comment', CommentSchema),
//     ReplyComment: mongoose.model('ReplyComment', ReplyCommentSchema)
// }


CommentSchema.pre('remove', async function(next) {
    try {
        await mongoose.model('ReplyComment').deleteMany({ parentComment: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

// ReplyCommentSchema.pre('remove', async function(next) {
//     try {
//       await mongoose.model('ReplyComment').deleteMany({ parentComment: this._id });
//       next();
//     } catch (err) {
//       next(err);
//     }
//   });


export const Comment = mongoose.model('Comment', CommentSchema);
export const ReplyComment = mongoose.model('ReplyComment', ReplyCommentSchema);

// const comment = await Post.findById(postId);
// await post.remove();