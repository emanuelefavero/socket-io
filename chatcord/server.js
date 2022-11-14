const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const formatMessage = require('./utils/messages')
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'ChatCord Bot'

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

    // Broadcast when a user connects (By using the broadcast method, we can send a message to everyone except for the user that is connecting)
    socket.broadcast
      .to(user.room) // emit to a specific room
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      )
  })

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    // NOTE: get the current user by using the socket.id in users.js find() method
    const user = getCurrentUser(socket.id)

    // Emit the msg from the client input to everybody, using io.emit
    io.to(user.room) // emit to a specific room
      .emit('message', formatMessage(user.username, msg))
  })

  // Runs when client disconnects
  socket.on('disconnect', () => {
    // get user that left the chat
    const user = userLeave(socket.id)

    if (user) {
      // emit to everybody that is in the room the user left
      io.to(user.room).emit(
        'message',
        formatMessage(user.username, `${user.username} has left the chat`)
      )
    }
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
