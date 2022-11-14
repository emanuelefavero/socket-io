const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

io.on('connection', socket => {
  console.log('a user connected')
  socket.broadcast.emit('user-connected', 'A user connected')

  socket.on('ping', () => {
    socket.emit('pong')
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    io.emit('user-disconnected', 'A user disconnected')
  })
})

app.use(express.static(path.join(__dirname, '../build')))
app.use(express.static('public'))

app.use((rea, res, next) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})

server.listen(3000, () => {
  console.log('Server is running on port 3000')
})
