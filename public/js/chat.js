// let mysql = require('mysql');
// let config = require('../../config');

// let connection = mysql.createConnection(config);


// function addFriend(username, friendname){
// 	var friendList;
// 	connection.query("SELECT friends FROM users WHERE username = ?", [username], function (err, result) {
// 		if (err) throw err;
// 		console.log("Friend: ", result);
// 		friendList = result;
// 	});	
// 	connection.query("UPDATE accounts SET friend = ? WHERE users = ?", [friendList + "," + friendname, username], function (err, addUserResult) {
// 		if (err) throw err;
// 		console.log(addUserResult.affectedRows + " record(s) updated");
// 	});
// }

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('usersTable');

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
var friends = userJSON[0]["friends"];
var friendsList = friends.split(",");
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
  socket.emit('chatMessage', msg + "ßΓ" + nickname + "ßΓ" + team + "ßΓ" + xp);

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
  //check for secret mode
  var secretMode = document.getElementById("secret").checked;
  if (secretMode == true) {
    p.innerText = "• " + message.nckName; // output nickname
  } else if (secretMode == false) {// output username and nickname
    p.innerText = "• " + message.username + " AKA " + message.nckName;
  }
  // out put the team and xp info
  p.innerHTML += `<span > ${" Team: " + message.team + " XP: " + message.xp} </span> <span>${" " + message.time} </span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.msgText; //output the message text
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}


// function addFriend(username, friendname){
// 	var friendList; 
//   var result;
// 	//connection.query("SELECT friends FROM users WHERE username = ?", [username], function (err, result) {
// 		//if (err) throw err;
// 		console.log("Friend: ", result);
// 		friendList = result;
// //	});	
// 	//connection.query("UPDATE accounts SET friend = ? WHERE users = ?", [friendList + "," + friendname, username], function (err, addUserResult) {
// 		//if (err) throw err;
// 	//	console.log(addUserResult.affectedRows + " record(s) updated");
// 	//});
// }

// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('li');
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// }

// Add users to DOM table
// this supposed to code for the add friend table
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    //
    const friendForm = document.createElement('form');
    friendForm.method = "post";
    //friendForm.id = "addfriendForm";
    //friendForm.style = "";
    
    //name
    const tdName = document.createElement('td');
    tdName.innerText = user.username;
    //tip
    const tdTip = document.createElement('td');
    tdTip.innerText = "+1";//tdTip.innerHTML = "<span> +1 <span>";
    const coinBtn = document.createElement('button');
    const coin = document.createElement('i');
    coin.className = "fas fa-coins";
    coin.style = "font-size:24px;color:gray";
    coin.onclick = tipUser();
    coinBtn.type = "submit";
    coinBtn.appendChild(coin);
    tdTip.appendChild(coinBtn);

    //block
    const tdBlock = document.createElement('td');
    const blockBtn = document.createElement('button');
    const block = document.createElement('i');
    block.className = "fa fa-ban";
    block.style = "font-size:24px;color:red";
    block.onclick = blockUser();
    blockBtn.type = "submit";
    blockBtn.appendChild(block);
    tdBlock.appendChild(blockBtn);
    
    //add friend
    var friendname = user.username;
    const tdFriend = document.createElement('td');
    const friendBtn = document.createElement('button');
    const friend = document.createElement('i');
    friendBtn.type = "submit";
    
    friendsList.forEach((friendObj) => {
      if (friendObj == friendname) {
        friend.className = "fa fa-check";
        console.log("Friend");
      } else {
        friend.className = "fa fa-plus-square";
        console.log("Not a Friend");
      }
    });

    
    //friend.className = "fa-circle-plus";
    //friend.className = "fa-solid fa-user-group";
    //friend.className = "fas fa-user-friends";
    friend.style = "font-size:24px;color:green";
    friend.name = "friend";
    //friend.onmouseup = "addFriend(" + username + "," + friendname + ")";
    //friend.onclick = addAnFriend(username, friendname);
    friendBtn.onclick = addFriend();
    friendBtn.appendChild(friend);
    tdFriend.appendChild(friendBtn);
    
    const tr = document.createElement('tr');
    
    friendForm.appendChild(tdName);
    friendForm.appendChild(tdTip);
    friendForm.appendChild(tdFriend);
    friendForm.appendChild(tdBlock);
    tr.appendChild(friendForm);
    userList.appendChild(tr);
  
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

function tipUser(){
  // take a coin from one user and add to the others account
};
function addFriend(){
  // used to follow a user, add them to the friend list once
};
function blockUser(){
  // remove friend from follow list and hide thier messages from the chat
};