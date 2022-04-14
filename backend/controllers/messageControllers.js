const expressAsyncHandler = require("express-async-handler");
const Message = require('../models/messageModel')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')

const sendMessage = expressAsyncHandler(async (req, res) => {
    const {content, chatId} = req.body
    if(!content || !chatId){
        return res.status(400).send('Invalid request. Please send the content and chat ID for the message')
    }
    const newMsg = { sender: req.user._id, content, chat: chatId}
    
    try {
        let message = await Message.create(newMsg)
        message =  await Message.findOne({_id: message._id}).populate('sender', 'name profilePic').populate('chat')
        message = await User.populate(message, {path: 'chat.users', select: 'name profilePic email status'})
        await Chat.findByIdAndUpdate(chatId, {latestMessage: message})
        res.status(201).json(message)
    } catch (error) {
        res.status(400).send(`Error. ${error.message}`)
    }
})

const fetchAllMessages = expressAsyncHandler(async (req, res) => {
    try {
        const allMessages = await Message.find({chat: req.params.chatId}).populate('sender', 'name profilePic email status').populate('chat')
        res.status(200).json(allMessages)
        
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = {sendMessage, fetchAllMessages}