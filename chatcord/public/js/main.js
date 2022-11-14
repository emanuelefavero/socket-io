const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// Get username and room from URL using qs
// Remember to add qs CDN in chat.html
// TIP: IF you use React Router, you can use the useParams hook to get the username and room or you can use qs library as an npm package (npm i qs)
const { username, room } = Qs.parse(location.search, {
  // Ignore prefixed symbols
  ignoreQueryPrefix: true,
})

const socket = io()

// Join chatroom
socket.emit('joinRoom', { username, room })

// Message from server
socket.on('message', (message) => {
  console.log(message)
  outputMessage(message)

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  roomName.innerText = room
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join('')}
  `
})

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Get message text from the input (using the id of the input, SEE id='msg' in chat.html)
  const msg = e.target.elements.msg.value

  // Emit the input message to the server
  socket.emit('chatMessage', msg)

  // Clear input and focus on it
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

// TODO: Change the color of your username (or your message card) to be different from the other users

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room
}
