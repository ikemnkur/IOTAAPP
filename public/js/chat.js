// let mysql = require('mysql');
// let config = require('../../config');

//const { user } = require("../../config");
//const { io } = require("socket.io-client");
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

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("usersTable");

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

var points = userJSON[0].coins;
var xp = userJSON[0].xp;
var friends = userJSON[0].friends;
var friendsList = friends.split(",");

const socket = io({transports: ["websocket"],pingInterval: 1000 * 60 * 5,
pingTimeout: 1000 * 60 * 3});

// Join chatroom
socket.emit("joinRoom", { username, nickname, points, xp, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
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
  socket.emit("chatMessage", msg + "ßΓ" + nickname + "ßΓ" + team + "ßΓ" + xp);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  //check for secret mode
  var secretMode = document.getElementById("secret").checked;
  if (secretMode == true) {
    p.innerText = "• " + message.nckName; // output nickname
  } else if (secretMode == false) {
    // output username and nickname
    p.innerText = "• " + message.username + " AKA " + message.nckName;
  }
  // out put the team and xp info
  p.innerHTML += `<span > ${
    " Team: " + message.team + " XP: " + message.xp
  } </span> <span>${" " + message.time} </span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.msgText; //output the message text
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
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

// Add users to DOM table
// this supposed to code for the add friend table
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    //
    //const friendForm = document.createElement('form');
    //friendForm.method = "post";
    //friendForm.id = "addfriendForm";
    //friendForm.style = "";
    //name
    const tdName = document.createElement("td");
    tdName.innerText = user.username;
    //tip
    const tdTip = document.createElement("td");
    tdTip.innerText = "+1"; //tdTip.innerHTML = "<span> +1 <span>";
    const coinBtn = document.createElement("button");
    const coin = document.createElement("i");
    coin.className = "fas fa-coins";
    coin.style = "font-size:24px;color:gray";
    coin.onclick = tipUser();
    coinBtn.type = "submit";
    coinBtn.appendChild(coin);
    tdTip.appendChild(coinBtn);

    //block
    const tdBlock = document.createElement("td");
    const blockBtn = document.createElement("button");
    const block = document.createElement("i");
    block.className = "fa fa-ban";
    block.style = "font-size:24px;color:red";
    block.onclick = blockUser();
    blockBtn.type = "submit";
    blockBtn.appendChild(block);
    tdBlock.appendChild(blockBtn);

    console.log(friendsList);

    //add friend
    var friendname = user.username;
    const tdFriend = document.createElement("td");
    const friendBtn = document.createElement("button");
    const friend = document.createElement("i");
    friendBtn.type = "submit";

    friendsList.forEach((friendObj) => {
      console.log(friendObj);
      //tdFriend.append(friendObj);
      if (friendObj == friendname) {
        friend.className = "fa fa-check";
        console.log("A friend");
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

    const tr = document.createElement("tr");

    tr.appendChild(tdName);
    tr.appendChild(tdTip);
    tr.appendChild(tdFriend);
    tr.appendChild(tdBlock);
    //tr.appendChild(friendForm);
    userList.appendChild(tr);

    tdTip.addEventListener("click", function () {
      //alert("Tip me");
      tipUser(username, tdName.innerText);
    });

    tdFriend.addEventListener("click", function () {
      addFriend(username, tdName.innerText);
    });

    tdBlock.addEventListener("click", function () {
      blockUser(tdName.innerText, room);
    });
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../home";
  } else {
  }
});

function tipUser(currentUser, tipUser) {
  // take a coin from one user and add to the others account
  payload = {
    currentUser: currentUser,
    tipUser: tipUser,
    coins: userJSON[0].coins
  };
  postData("http://localhost:3001/tip", payload).then((data) => {
    //console.log(data);
  });
}
function addFriend(currentUser, tipUser) {
  // used to follow a user, add them to the friend list once
  payload = {
    currentUser: currentUser,
    tipUser: tipUser
  };
  postData("http://localhost:3001/follow", payload).then((data) => {
    //console.log(data);
  });
}
function blockUser(tipUser, roomId) {
  // remove friend from follow list and hide thier messages from the chat
  payload = {
    tipUser: tipUser,
    roomId: roomId
  };
  postData("http://localhost:3001/block", payload).then((data) => {
    //console.log(data);
  });
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
