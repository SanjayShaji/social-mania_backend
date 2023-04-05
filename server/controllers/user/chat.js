import Chat from "../../models/Chat.js";
import User from "../../models/User.js";

export const createChat = async(req, res)=>{
    const chat = await Chat.findOne({
        members: {$all: [req.body.receiverId]}
    })

    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId]
    });

    try{
        let result = ''
        if(!chat){
            result = await newChat.save();
        }
        console.log(result)
        res.status(200).json(result);
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

export const userChats = async(req,res)=>{
    try {
        console.log(req.params)
        const chat = await Chat.find({
            members: {$in: [req.params.userId]}
        }).populate('members', '-password')
        console.log(chat)

        // const chat = await Chat.find({
        //     members: {$in: [req.params.userId]}
        // })
        // console.log(chat.members)
        // const chatMember = chat.filter(mem=> mem != req.params.userId);
        // console.log(chatMember);
        // const member =await User.findById(chatMember[0])
        // console.log(member);

        res.status(200).json(chat)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export const findChat = async(req, res)=>{
    try {
        const chat = await Chat.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}