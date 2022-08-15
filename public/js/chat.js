
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

console.log("USER JSON: ", userJSON);

const username = userJSON[0]["username"];
// const username = user.username;
const room = roomJSON[0]["roomID"];
const topic = roomJSON[0]["topic"];

var points = userJSON[0].coins;
var xp = userJSON[0].xp;
var friends = userJSON[0].friends;
var friendsList = friends.split(",");

const socket = io({
  transports: ["websocket"], pingInterval: 1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3
});

// Join chatroom
socket.emit("joinRoom", { username, nickname, points, xp, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(topic);
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
    if (message.nckName == '') {
      p.innerText = "• " + message.username;
    } else {
      // output username and nickname
      p.innerText = "• " + message.username + " AKA " + message.nckName;

    }
  }
  // out put the team and xp info
  p.innerHTML += `<span > ${" Team: " + message.team + " XP: " + message.xp
    } </span> <span>${" " + message.time} </span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.msgText; //output the message text
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

function teamsDisplay() {
  var teams = document.getElementById("teamnames");
  var teamlist = teams.innerText.split(",");
  teams.innerText = '';
  teamlist.forEach((item, index) => {
    const list = document.createElement("li");
    list.style = "list-style-type: none;";
    const listText = document.createElement("a");
    listText.innerText = item;
    //list.innerText = item; 
    var btn = document.createElement("button");
    btn.innerText = "Join";
    btn.style = "padding-left: 2px; color: black;";
    list.appendChild(listText);
    list.appendChild(btn);
    teams.appendChild(list);
  })
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM table
// this supposed to code for the add friend table
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    console.log("user.username = ", user.username);
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

      console.log(friendsList);

      //add friend
      var friendname = user.username;
      const tdFriend = document.createElement("td");
      const friendBtn = document.createElement("button");
      const friend = document.createElement("i");
      friendBtn.type = "submit";

      friendsList.forEach((item, index) => {
        console.log(item);
        //tdFriend.append(friendObj);
        if (item == friendname) {
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
      // friendBtn.onclick = addFriend();
      friendBtn.appendChild(friend);
      tdFriend.appendChild(friendBtn);

      tdTip.addEventListener("click", function () {
        alert("Tip me");
        if (username != tdName.innerText) {
          tipUsers(username, tdName.innerText);
          console.log(`${username} Tipped ${tdName.innerText}`);
        }
      });

      tdFriend.addEventListener("click", function () {
        addFriend(username, tdName.innerText);
      });

      tdBlock.addEventListener("click", function () {
        blockUser(tdName.innerText, room);
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

// function tipUser(currentUser, tipUser) {
//   // take a coin from one user and add to the others account
//   payload = {
//     currentUser: currentUser,
//     tipUser: tipUser,
//     coins: userJSON[0].coins
//   };
//   postData("http://localhost:" + portnum + "/tip", payload).then((data) => {
//     //console.log(data);
//   });
// }


async function tipUsers(currentUser, userToTip) {
  var payload = {
    "currentUser": currentUser,
    "userToTip": userToTip,
    // coins: userJSON[0].coins
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

async function addFriend(currentUser, userToFollow) {
  // used to follow a user, add them to the friend list once
  var payload = {
    "currentUser": currentUser,
    "userToFollow": userToFollow
  };
  postData("http://localhost:" + portnum + "/follow", payload).then((data) => {
    console.log(data);
  });
}

async function blockUser(userToBlock, roomId) {
  // remove friend from follow list and hide thier messages from the chat
  var payload = {
    "userToBlock": userToBlock,
    "roomId": roomId
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