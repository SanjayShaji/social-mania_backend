import mongoose, { Schema, Types, model } from 'mongoose';
import { Comment } from './Comment.js';
// const commentSchema = require('./Comment');

const PostSchema = Schema({

  poster: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,

  },
  files: [
    {
      type: String
    }
  ],
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Map,
    of: Boolean,
    default: {}
  },

  // comments : {
  //     type: mongoose.Types.ObjectId,
  //     ref: "Comment",

  // },
  commentCount: {
    type: Number,
    default: 0
  },
  report: {
    type: Array,
    default: []
  },
  status: {
    type: Boolean,
    default: true
  },
  edited: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true }
);


PostSchema.pre('remove', async function (next) {
  try {
    await Comment.deleteMany({ post: this._id });
    next();
  } catch (err) {
    next(err);
  }
});


const Post = mongoose.model("Post", PostSchema);
export default Post;