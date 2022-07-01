const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatJSONtext = document.getElementById("roomJSON");
const chatJSON = JSON.parse(chatJSONtext.innerText);

// Get username and room from URL
// const {roomID, topic, user } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });

const team = document.getElementById("teams").value;
var nickname = document.getElementById("nickname").value;
var secretMode = document.getElementById("secret").checked;
const username = document.getElementById("roomuser").innerText;
const room = chatJSON[0]["roomID"];
const topic = chatJSON[0]["topic"];
var points = 0;
const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

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

  // Emit message to server
  socket.emit('chatMessage', msg);

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
  nickname = document.getElementById("nickname").value;
  secretMode = document.getElementById("secret").checked;
  if (secretMode == true) {
    p.innerText = "• " + document.getElementById("nickname").value;
  } else if (secretMode == false){
    p.innerText = "• " + message.username + " AKA " + document.getElementById("nickname").value;
  }

  p.innerHTML += `<span > ${" Team: " + team + " XP: " + points} </span> <span>${" " + message.time} </span>`;
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
