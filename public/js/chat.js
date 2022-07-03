const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const roomJSONtext = document.getElementById("roomJSON");
const userJSONtext = document.getElementById("userJSON");

const roomJSON = JSON.parse(roomJSONtext.innerText);
const userJSON = JSON.parse(userJSONtext.innerText);

// Get username and room from URL
// const {roomID, topic, user } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });

const username = document.getElementById("roomuser").innerText;
const room = roomJSON[0]["roomID"];
const topic = roomJSON[0]["topic"];

var points = userJSON[0]["coins"];
var xp = userJSON[0]["xp"];
const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, nickname, points, xp, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }  
  var team = document.getElementById("teams").value;
  var nickname = document.getElementById("nickname").value;
  // Emit message to server
  socket.emit('chatMessage', msg + "ßΓ" + nickname + "ßΓ" + team);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  var secretMode = document.getElementById("secret").checked;
  if (secretMode == true) {
    p.innerText = "• " + message.nickname;
  } else if (secretMode == false){
    p.innerText = "• " + message.username + " AKA " +  message.nickname;
  }

  p.innerHTML += `<span > ${" Team: " + message.team + " XP: " + message.xp} </span> <span>${" " + message.time} </span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../home';
  } else {
  }
});
