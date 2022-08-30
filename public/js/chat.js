
const portnum = 3000;

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

const username = userJSON[0]["username"];
const nickname = document.getElementById("nickname");
const team = document.getElementById("team");
const room = roomJSON[0]["roomID"];
const topic = roomJSON[0]["topic"];

var points = userJSON[0].coins;
var xp = userJSON[0].xp;
var friendsList = JSON.parse(userJSON[0].friends);
const blocked = userJSON[0].blockedUsers;
var activeUsers;

const socket = io({
  transports: ["websocket"], pingInterval: 1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3
});

// Join chatroom
socket.emit("joinRoom", { username, nickname, points, xp, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  activeUsers = users;
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  // console.log("Socket IO Message: ", message);
  
  if (blocked.indexOf(message.username) < 0)
    outputMessage(message);
  else {
    message.msgText = "BLOCKED";
    outputMessage(message);
  }

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
  var team = document.getElementById("team").innerText;
  var nickname = document.getElementById("nickname").innerText;
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
  var secretMode = document.getElementById("secretMode").checked;
  if (secretMode == true) {
    p.innerText = "• " + message.nckName; // output nickname
  } else if (secretMode == false) {
    if (message.nckName == '') {
      p.innerText = "• " + message.username;
    } else {
      // output username and nickname
      p.innerText = "• " + message.username + " AKA " + message.nckName;

    }
  }
  // out put the team and xp info
  if (message.username == "BOT"){
    p.innerHTML = `• CHATBOT <span>${" " + message.time} </span>`;
  } else {
    p.innerHTML += `<span > ${" Team: " + message.team + " XP: " + message.xp
    } </span> <span>${" " + message.time} </span>`;
  }
  
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.msgText; //output the message text
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

function teamsDisplay() {

  var teamBox = document.getElementById("teamnames");
  var teams = JSON.parse(teamBox.innerText);
  teamBox.innerText = '';
  var tbl = document.createElement("table");
  var tbody = document.createElement("tbody");

  teams.forEach((item, index) => {
    //console.log(`teams Obj: ${index}. ${item}`);
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let tdBtn = document.createElement("td");
    var btn = document.createElement("button");
    btn.innerText = "Join"; btn.style = "padding-left: 2px; color: black;";
    td.innerText = item; tdBtn.append(btn);
    tr.appendChild(td); tr.appendChild(tdBtn);
    tbody.appendChild(tr)
  });
  tbl.appendChild(tbody);
  teamBox.appendChild(tbl);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = "Room ID: " + room;
}

// Add users to DOM table
// this supposed to code for the add friend table
function outputUsers(users) {
  userList.innerHTML = "";
  console.log("Output Users: ", users);
  users.forEach((user) => {
    // console.log("user.username = ", user.username);
    if (user.username == userJSON[0].username) {
      const tdName = document.createElement("td");
      tdName.innerText = user.username;
      const tr = document.createElement("tr");
      tr.appendChild(tdName);
      userList.appendChild(tr);

    } else {
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
      // coin.onclick = tipUsers();
      coinBtn.type = "submit";
      coinBtn.appendChild(coin);
      tdTip.appendChild(coinBtn);

      //block
      const tdBlock = document.createElement("td");
      const blockBtn = document.createElement("button");
      const block = document.createElement("i");
      block.className = "fa fa-ban";
      block.style = "font-size:24px;color:red";
      // block.onclick = blockUser();
      blockBtn.type = "submit";
      blockBtn.appendChild(block);
      tdBlock.appendChild(blockBtn);

      // console.log("List of Friends", friendsList);

      //add friend
      const tdFriend = document.createElement("td");
      const friendBtn = document.createElement("button");
      const friendIcon = document.createElement("i");
      friendBtn.type = "submit";

      if (friendsList.length > 0) {
        //tdFriend.append(friendObj);
        for (const [index, val] of friendsList.entries()) {
          // friendsList.forEach((item, indx) => {
          if (user.username == val) {
            friendIcon.className = "fa fa-check";
            //console.log(val, " is followed");
            break;
          } else {
            friendIcon.className = "fa fa-plus-square";
            //console.log(val, " is not followed");
          }
        }
      } else {
        friendIcon.className = "fa fa-plus-square";
      }

      //friendIcon.className = "fa-circle-plus";
      //friendIcon.className = "fa-solid fa-user-group";
      //friendIcon.className = "fas fa-user-friends";
      friendIcon.style = "font-size:24px;color:green";
      friendIcon.name = "friend";
      //friendIcon.onmouseup = "addFriend(" + username + "," + friendname + ")";
      //friendIcon.onclick = addAnFriend(username, friendname);
      // friendBtn.onclick = addFriend();
      friendBtn.appendChild(friendIcon);
      tdFriend.appendChild(friendBtn);

      tdTip.addEventListener("click", function () {
        alert("Tip me");
        if (username != tdName.innerText) {
          tipUsers(username, tdName.innerText);
          console.log(`${username} Tipped ${tdName.innerText}`);
        }
      });

      //var activeFriend = 

      tdFriend.addEventListener("click", function () {
        addFriend(username, tdName.innerText,friendIcon.className);
      });

      tdBlock.addEventListener("click", function () {
        blockUser(tdName.innerText, room, username);
      });

      const tr = document.createElement("tr");

      tr.appendChild(tdName);
      tr.appendChild(tdTip);
      tr.appendChild(tdFriend);
      tr.appendChild(tdBlock);
      //tr.appendChild(friendForm);
      userList.appendChild(tr);

    }
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

async function tipUsers(currentUser, userToTip) {
  var payload = {
    "currentUser": currentUser,
    "userToTip": userToTip,
  };
  postData("http://localhost:3000/tip", payload);
  // const res = await fetch("http://localhost:3000/tip", {
  //   method: "POST",
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  //   body: payload,
  // });
}

async function addFriend(currentUser, userToFollow, action) {
  // used to follow a user, add them to the friend list once
  var payload = {
    "currentUser": currentUser,
    "userToFollow": userToFollow,
    "action": action
  };
  postData("http://localhost:" + portnum + "/follow", payload).then((data) => {
    console.log(data);
  });
}

async function blockUser(userToBlock, roomId, currentUser) {
  // remove friend from follow list and hide thier messages from the chat
  var payload = {
    "userToBlock": userToBlock,
    "roomId": roomId,
    "currentUser": currentUser
  };
  postData("http://localhost:" + portnum + "/block", payload).then((data) => {
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
  console.log("Posted data: ", data);
  return response.json(); // parses JSON response into native JavaScript objects
}

teamsDisplay();