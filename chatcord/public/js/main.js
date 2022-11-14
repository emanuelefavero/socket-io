const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

const socket = io()

// Message from server
socket.on('message', message => {
  console.log(message)
  outputMessage(message)

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault()

  // Get message text from the input (using the id of the input, SEE id='msg' in chat.html)
  const msg = e.target.elements.msg.value

  // Emit the input message to the server
  socket.emit('chatMessage', msg)

  // Clear input and focus on it
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

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
