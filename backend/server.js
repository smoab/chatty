const express = require('express')
const {createServer} = require('http')
const dotenv = require('dotenv')
const {Server} = require('socket.io')
const connectToDB = require('./config/db')
const userRouter = require('./routes/userRoutes')
const chatRouter = require('./routes/chatRoutes')
const messagingRouter = require('./routes/messagingRoutes')
const {pageNotFound, errorHandler} = require('./middleware/errors')

const app = express()

dotenv.config()
connectToDB()
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messagingRouter)
app.use(pageNotFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
//const server = app.listen(PORT, console.log(`Server started on port localhost:${PORT}`))
const httpServer = createServer(app)
const io = new Server(httpServer, {pingTimeout: 60000, cors: {origin: "http://localhost:3000"}})
io.on('connection', socket => {

    socket.on('setup', userData => {
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', room => {
        socket.join(room)
    })

    socket.on('left chat', room => {
        socket.leave(room)
    })

    socket.on('new message', newMsg => {
        const chat = newMsg.chat
        if (!chat.users){
            console.log('chat users are not defined')
            return
        }
        chat.users.forEach( user => {
            if (user._id === newMsg.sender._id){
                return
            }
            socket.in(user._id).emit('message received', newMsg)
        })
    })

    socket.on('typing started', room => socket.in(room).emit('typing started'))
    socket.on('typing stopped', room => socket.in(room).emit('typing stopped'))

    socket.off('setup', () => {
        console.log('User is disconnected')
        socket.leave(userData._id)
    })

})
httpServer.listen(PORT)