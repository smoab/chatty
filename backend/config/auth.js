const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const generateAuthToken = (name, id) => {
    return jwt.sign({username: name, id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

const comparePasswords = async (pwd, hashedPwd) => {
    const isMatch = await bcrypt.compare(pwd, hashedPwd)
    return isMatch
}

module.exports = {generateAuthToken, comparePasswords}