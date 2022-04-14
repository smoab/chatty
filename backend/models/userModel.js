const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    status: {type: String, required: true, default: "Available"},
    profilePic: {type: String, required: true, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    },
    {timestamps: true}
)


// userSchema.pre("save", async function (next) {
//     if (!this.isModified) next()
    
//     const salt =  bcrypt.genSaltSync(10)
//     this.password = await bcrypt.hash(this.password, salt)
// })

const User = mongoose.model("User", userSchema)

module.exports = User