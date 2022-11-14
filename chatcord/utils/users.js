const users = []

// join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room }

  users.push(user)

  return user
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

// User leaves chat
function userLeave(id) {
  // Find the index of the user
  // NOTE: if no element passed the test, findIndex() will return -1
  const index = users.findIndex((user) => user.id === id)

  // If the user exists, remove it from the array
  if (index !== -1) {
    // Return the removed user
    return users.splice(index, 1)[0] // the zero is to get the first element of the array
  }
}

// Get room users, it gets all the users in a specific room
function getRoomUsers(room) {
  return users.filter((user) => user.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
}
