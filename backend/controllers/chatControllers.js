const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const createChat = asyncHandler(async (req, res) => {
    const {recepientId} = req.body

    if(!recepientId) {
        res.status(400).send('Recepient ID is not included in the request body') 
    }

    let foundChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: recepientId}}}
        ]
    }).populate('users', '-password').populate('latestMessage')
    foundChat = await User.populate(foundChat, {
        path: 'latestMessage.sender',
        select: 'name email profilePic status'
    })

    if(foundChat.length > 0){
        res.status(200).send(foundChat[0])
    } else {
        let chatData = {
            chatName: 'PrivateChat',
            isGroupChat: false,
            users: [req.user._id, recepientId]
        }
        try {
            const newChat = await Chat.create(chatData)
            const detailedNewChat = await Chat.findOne({_id: newChat._id}).populate('users', '-password')
            res.status(201).json(detailedNewChat)

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

const fetchAllChats = asyncHandler(async (req, res) => {
    try {
        let allChats = await Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
                                .populate('users', '-password').populate('groupAdmin', '-password').populate('latestMessage')
                                .sort({updatedAt: -1})
        let detailedAllChats = await User.populate(allChats, {path: 'latestMessage.sender', select: 'name email profilePic status'})
        res.status(200).json(detailedAllChats)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const createGroup = asyncHandler(async (req, res) => {
    if (!req.body.addedUsers || !req.body.chatName){
        return res.status(400).send({message: 'Please add a name and at least two members to create the group'})
    }

    let addedUsers = JSON.parse(req.body.addedUsers)
    if (addedUsers.length < 2){
        return res.status(400).send('At least two members needed to create a group chat')
    }
    addedUsers.push(req.user)

    try {

        const newGroup = await Chat.create({chatName: req.body.name, users: addedUsers, isGroupChat: true, groupAdmin: req.user})
        const detailedNewGroup = await Chat.findOne({_id: newGroup._id}).populate('users', '-passwords').populate('groupAdmin', '-password')
        res.status(201).json(detailedNewGroup)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const {chatId, newName} = req.body
    const updatedGroup = await Chat.findByIdAndUpdate(chatId, {chatName: newName,}, {new: true,})
                                                    .populate('users', '-password').populate('groupAdmin', '-password')

    if (!updatedGroup){
        res.status(400)
        throw new Error('Chat was not found')
    } else {
        res.json(updatedGroup)
    }
})

const addToGroup = asyncHandler(async (req, res) => {

    const {chatId, memberId} = req.body

    const addedMemberChat = await Chat.findByIdAndUpdate(
        chatId,
        {$push: {users: memberId}},
        {new: true}
    ).populate('users', '-password').populate('groupAdmin', '-password')

    if (!addedMemberChat){
        res.status(404)
        throw new Error('Chat is not found')
    } else {
        res.json(addedMemberChat)
    }
})

const removeFromGroup = asyncHandler(async (req, res) => {

    const {chatId, memberId} = req.body

    const removedMemberChat = await Chat.findByIdAndUpdate(
        chatId,
        {$pull: {users: memberId}},
        {new: true}
    ).populate('users', '-password').populate('groupAdmin', '-password')

    if (!removedMemberChat){
        res.status(404)
        throw new Error('Chat is not found')
    } else {
        res.json(removedMemberChat)
    }
})

module.exports = {
    createChat,
    fetchAllChats,
    createGroup,
    renameGroup,
    addToGroup,
    removeFromGroup
}