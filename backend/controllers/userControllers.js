const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const {generateAuthToken, comparePasswords} = require('../config/auth')

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    const didUploadPic = req.body.profilePic ? true : false
    
    if(!name || !email || !password){
        res.status(400)
        throw new Error('Enter all the required fields please.')
    }

    const userDoesExist = await User.findOne({email})
    if (userDoesExist){
        res.status(400)
        throw new Error('User with the same email already exists, please login instead')
    }

    const salt =  bcrypt.genSaltSync(10)
    Hashedpassword = await bcrypt.hash(password, salt)

    const newUser = didUploadPic
        ? await User.create({name, email, password: Hashedpassword, profilePic})
        : await User.create({name, email, password: Hashedpassword})

    if (newUser){
        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePic: newUser.profilePic,
            token: generateAuthToken(newUser._id)
        })
    } else {
        res.status(400)
        throw new Error('Creating a new account has failed, please try again')
    }

})

const authUser = asyncHandler(async (req, res) => {

    const {email, password} = req.body
    const user = await User.findOne({email})
    const passwordOK = await comparePasswords(password, user.password)

    if (user && passwordOK){
        const userToken = generateAuthToken(user.name, user._id)
        res.json({_id: user._id, name: user.name, email: user.email, profilePic: user.profilePic, status: user.status, token: userToken})
    } else {
        res.status(401)
        throw new Error('Invalid credentials, please try again')
    }
})

const getUsers = asyncHandler(async (req, res) => {
    const matches = req.query.searchUser
        ? {
            $or: [
                {name: {$regex: req.query.searchUser, $options: 'i'}},
                {email: {$regex: req.query.searchUser, $options: 'i'}}
            ]
        }
        : {}

        const usersFound = await User.find(matches).find({_id: {$ne: req.user._id}})
        res.send(usersFound)
})

module.exports = {
    registerUser,
    authUser,
    getUsers
}