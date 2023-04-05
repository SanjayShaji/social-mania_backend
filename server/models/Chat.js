import mongoose, { Types } from "mongoose";

const ChatSchema = mongoose.Schema({
    members: {
        type: Array,
        ref: "User",
        required: true
    }
},
{ timestamps: true }
)

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
