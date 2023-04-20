import Post from "../../models/Post.js";
import User from "../../models/User.js";

export const getUsers = async(req, res)=>{
    try {
        console.log("reached users");
        console.log(req.query);
        const users = await User.find({}).select('-password');
        console.log(users);
        res.status(200).json({users: users})
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

export const getUser = async(req, res)=>{
    try {
        console.log("reached users");
        console.log(req.params);
        const {id} = req.params
        const user = await User.findOne({_id: id}).select('-password');
        console.log(user);
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

export const getSearchUsers = async(req, res)=>{
    try {
        console.log("reached users");
        const { searchName} = req.params
        console.log(searchName);
        const users = await User.find({firstName: {$regex: searchName, $options: "i"}})
        console.log(users);
        res.status(200).json({users: users})
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

export const getReportedPosts = async(req, res)=>{
    try {
        console.log("reached reported posts");
        console.log(req.query);
        const reportedPosts = await Post.find({report : {$exists : true, $ne : []}})
        console.log(reportedPosts);
        res.status(200).json(reportedPosts)
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

export const blockPost = async (req, res) => {
    try {
        console.log("reached to block user");
        const { id } = req.params;
        console.log(req.params);
        const post = await Post.findById(id);
        // const isLiked = post.likes.get(userId);

        if (post.status) {
            post.status = false;
        } else {
            post.status = true;
            await Post.updateOne({_id : id}, {
                $set : {report: []}
            })
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { status: post.status },
            { new: true }
        );
        const reportedPosts = await Post.find({report : {$exists : true, $ne : []}})

        console.log(updatedPost);
        res.status(200).json(reportedPosts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}
export const blockUser = async (req, res) => {
    try {
        console.log("reached to block user");
        const { id } = req.params;
        console.log(req.body);
        const user = await User.findById(id);
        // const isLiked = post.likes.get(userId);

        if (user.status) {
            user.status = false;
        } else {
            user.status = true;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { status: user.status },
            { new: true }
        ).select('-password');

        console.log(updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}