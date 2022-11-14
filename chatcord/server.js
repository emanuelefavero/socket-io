const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const formatMessage = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'ChatCord Bot'

// Run when client connects
io.on('connection', socket => {
  // Welcome current user
  socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

  // Broadcast when a user connects (By using the broadcast method, we can send a message to everyone except for the user that is connecting)
  socket.broadcast.emit(
    'message',
    formatMessage(botName, 'A user has joined the chat')
  )

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'))
  })

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    // Emit the msg from the client input to everybody, using io.emit
    io.emit('message', formatMessage('USER', msg))
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
