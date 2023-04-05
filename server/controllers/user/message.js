import Message from "../../models/Message.js";

export const addMessage = async(req, res)=>{
    try {
    const {chatId, senderId, text} = req.body;
    const message = new Message({
        chatId,
        senderId,
        text
    });
    const result = await message.save();
    res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export const getMessages = async(req, res)=>{
    try {
        const {chatId} = req.params;
        console.log(chatId)
        const result = await Message.find({chatId})
        console.log(result)
        res.status(200).json(result);
    } catch (error) {
        res.staus(400).json({error: error.message})
    }
}
