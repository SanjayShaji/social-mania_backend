import Post from "../../models/Post.js";
import User from "../../models/User.js";
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
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
    folder: 'project/posts',
    public_id: new Date() + '_' + uuid
};

export const getUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

export const getUsers = async(req, res)=>{
    try {
        console.log("reached users");
        const {userId} = req.query
        console.log(req.query);
        const users = await User.find({_id: {$ne: userId}}).select('-password');
        console.log(users);
        res.status(200).json({users: users})
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

export const getSearchUsers = async(req, res)=>{
    try {
        console.log("reached users");
        const { searchName} = req.params
        const {userId} = req.query
        console.log(userId);
        console.log(searchName);
        const users = await User.find({_id: {$ne: userId}, firstName: {$regex: searchName, $options: "i"}})
        console.log(users);
        res.status(200).json({users: users})
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

export const getUserFriends = async(req, res)=>{
    try {
        const {id} = req.params;
        console.log("req.params");
        console.log(req.params);
        console.log("req.params");
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id)=> User.findById(id))
        );
    console.log("friends");
    console.log(friends);
    console.log("friends");
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, profileImage})=>{
                return {_id, firstName, lastName, profileImage}
            }
        )
        console.log("formattedFriends");
        console.log(formattedFriends);
        console.log("formattedFriends");
       res.status(200).json(formattedFriends); 
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


//update
export const friendRequest =  async(req, res)=>{
    try {
        console.log("reached friendRequests");
        const {id} = req.params;
        const {userId} = req.body;
        const user = await User.findById(userId);
        const friend = await User.findById(id);

        // console.log(friend);
        
        if(user.sentFriendRequests.includes(id)){
            user.sentFriendRequests.pull(id);
            friend.recievedFriendRequests.pull(userId);
        }else{
            user.sentFriendRequests.push(id)
            friend.recievedFriendRequests.push(userId);
        }

        await user.save();
        await friend.save();

        const sentRequests = await Promise.all(
            user.sentFriendRequests.map((id)=> User.findById(id))
        )
        
        const sentFriendRequests = sentRequests.map(
            ({_id, firstName, lastName, profileImage})=>{
                return {_id, firstName, lastName, profileImage}
            }
        )

        // const updatedUser = await User.findByIdAndUpdate(
        //     userId,
        //     {sentFriendRequests: user.sentFriendRequests, recievedFriendRequests: user.recievedFriendRequests},
        //     {new: true}
        // );

        // const updatedFriend = await User.findByIdAndUpdate(
        //     id,
        //     {sentFriendRequests: friend.sentFriendRequests, recievedFriendRequests: friend.recievedFriendRequests},
        //     {new: true}
        // )

        console.log("updatedUser");
        console.log(sentFriendRequests);
        console.log("updatedUser"); 
        res.status(200).json(sentFriendRequests);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const acceptRejectFriendRequest = async(req, res)=>{
    try {
        console.log("hoiiii");
        const {id} = req.params;
        const {status} = req.query;
        const {userId} = req.body;
        const user = await User.findById(userId);
        const friend = await User.findById(id);

        if(user.recievedFriendRequests.includes(id) && status == "accept"){
            user.friends.push(id);
            friend.friends.push(userId);
        }
        // else{
        //     user.friends.pull(id);
        //     friend.friends.pull(userId);
        // }

        user.recievedFriendRequests.pull(id)
        friend.sentFriendRequests.pull(userId)
        

        await user.save();
        await friend.save();

        // const updatedUser = await User.findByIdAndUpdate(
        //     userId, 
        //     {
        //         friends: user.friends, 
        //         recievedFriendRequests: user.recievedFriendRequests,
        //         sentFriendRequests : user.sentFriendRequests
        //     },
        //     {new: true}
        // );

        // const updatedFriend = await User.findByIdAndUpdate(
        //     id,
        //     {
        //         friends: friend.friends, 
        //         recievedFriendRequests: friend.recievedFriendRequests,
        //         sentFriendRequests : friend.sentFriendRequests
        //     },
        //     {new: true}
        // );

        const receivedRequests = await Promise.all(
            user.recievedFriendRequests.map((id)=> User.findById(id))
        )

        const recievedFriendRequests = receivedRequests.map(
            ({_id, firstName, lastName, profileImage}) => {
                return {_id, firstName, lastName, profileImage}
            }
        )

        const sentRequests = await Promise.all(
            user.recievedFriendRequests.map((id)=> User.findById(id))
        )

        const sentFriendRequests = sentRequests.map(
            ({_id, firstName, lastName, profileImage}) => {
                return {_id, firstName, lastName, profileImage}
            }
        )

        const friends = await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )
        const userFriends = friends.map(
            ({_id, firstName, lastName, profileImage}) =>{
                return {_id, firstName, lastName, profileImage}
            }
        )

        // console.log(updatedUser);
        console.log({recievedFriendRequests, sentFriendRequests, userFriends})
        res.status(200).json({recievedFriendRequests,sentFriendRequests,  userFriends})

    } catch (error) {
        res.status(404).json({message: error.message})

    }
}

export const removeFriend = async(req, res)=>{
    try {
        console.log("hoiiii");
        const {id} = req.params;
        const {userId} = req.body;
        const user = await User.findById(userId);
        const friend = await User.findById(id);

        //remove
        if(user.friends.includes(id)){
            user.friends.pull(id);
            friend.friends.pull(userId);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )
        const userFriends = friends.map(
            ({_id, firstName, lastName, profileImage}) =>{
                return {_id, firstName, lastName, profileImage}
            }
        )

        console.log(userFriends)
        res.status(200).json(userFriends)

    } catch (error) {
        res.status(404).json({message: error.message})

    }
}

export const getUserFriendRequests = async(req,res)=>{
    try {
        console.log("reachedddd");
        console.log(req.body)
        const {userId} = req.body;
        const user = await User.findById(userId)
        const recievedFriendRequests = await Promise.all(
            user.recievedFriendRequests.map((id) => User.findById(id).select("firstName lastName profileImage"))
        )

        const sentFriendRequests = await Promise.all(
            user.sentFriendRequests.map((id)=> User.findById(id).select("firstName lastName profileImage"))
        )
        console.log(recievedFriendRequests);

        res.status(200).json({recievedFriendRequests, sentFriendRequests})
        // let friends = await User.find({_id: {$in: }})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const uploadProfile = async(req, res)=>{
    try { 
        
        console.log(req.body);
        const { userId } = req.body;
        console.log(req.file);
        let result = await cloudinary.uploader.upload(req.file.path, opts)
        console.log(result)

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {profileImage: result.url},
            {new: true}
        ).select('-password');
        
        console.log(updateUser)
        res.status(202).json(updateUser);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

export const uploadCover = async(req, res)=>{
    try { 
        console.log(req.body);
        const { userId } = req.body;
        console.log(req.file);
        let result = await cloudinary.uploader.upload(req.file.path, opts)
        console.log(result)

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {coverImage: result.url},
            {new: true}
        ).select('-password');
        
        console.log(updateUser)
        res.status(202).json(updateUser);


    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}