const users = [];
var activeRoom;

// Join user to chat
function userJoin(id, username, nickname, points, xp, room, secretMode, team, score) {
  const user = { id, username, nickname, points, xp, room, secretMode, team, score };
  activeRoom = user.room;
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function getActiveUsers(){
  usernameArr = [];
  users.forEach((item, index) => {
    usernameArr.push(item.username);
  });
  return usernameArr;
}

function getActiveRoom(){
  return activeRoom;
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getActiveUsers, 
  getActiveRoom,
  getRoomUsers
};

