
const portnum = 3000;

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const UserStats = document.getElementById("user-stats");
const userList = document.getElementById("usersTable");

const roomJSONtext = document.getElementById("roomJSON");
const userJSONtext = document.getElementById("userJSON");

const roomJSON = JSON.parse(roomJSONtext.innerText);
const userJSON = JSON.parse(userJSONtext.innerText);

// Get username and room from URL
// const {roomID, topic, user } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
var blockedList = JSON.parse(userJSON[0].blockedUsers);
const username = userJSON[0]["username"];
const nickname = document.getElementById("nickname").innerText;
var team = document.getElementById("team").innerText;
const teams = JSON.parse(document.getElementById("teamnames").innerText);
const room = roomJSON[0]["roomID"];
const topic = roomJSON[0]["topic"];

var secretMode = document.getElementById("secretMode").innerText;
var coins = userJSON[0].coins;
var xp = userJSON[0].xp;
var score = 0, scores = {};
var friendsList = JSON.parse(userJSON[0].friends);
const blocked = userJSON[0].blockedUsers;
var activeUsers;

var colors = ["green", "cyan", "pink", "gold", "agua", "red", "thistle", "lightcyan", "salmon", "crismon", "springgreen", "sykblue", "seagreen", "greenyellow", "fuschia", "lavender", "magenta"]
var focusedStyle = "background: radial-gradient(#ac1b1b, transparent);"
const socket = io({
  transports: ["websocket"], pingInterval: 1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3
});

// Join chatroom
socket.emit("joinRoom", { username, nickname, coins, xp, room, secretMode, team });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  activeUsers = users;
  displayUserStats();
  outputUsers(users);
});

socket.on('tipEvent', (tipperUsername, msg_username, coinsAmount, roomid) => {
  if (roomid == room) {
    if (msg_username == username) {
      coins += coinsAmount;
      console.log("You have been tipped by ", tipperUsername);
    }
    if (tipperUsername == username) {
      coins -= coinsAmount;
      console.log("You just tipped ", msg_username);
    }
  }
})

socket.on("vote", (msg_ID, vote, msg_username) => {
  if (document.getElementById(msg_ID) != null) {
    console.log("msg ID: ", msg_ID);
    if (vote == "like") {
      var upvotes = document.getElementById(msg_ID).querySelector('#like');
      upvotes.innerText = parseInt(upvotes.innerText) + 1;
      if (msg_username == username)
        xp += 2;
    }
    if (vote == "hate") {
      var downvotes = document.getElementById(msg_ID).querySelector('#hate');
      downvotes.innerText = parseInt(downvotes.innerText) + 1;
      if (msg_username == username)
        xp -= 1;
    }
  }
});

socket.on("Scores", (roomName, scoreData) => {
  console.log("Scores Event: ", scoreData)
  // if (room == roomName)
  scores = scoreData;
});

function updates() {
  socket.emit('updateStats', xp, coins, username, 50, team, room);
  // socket.emit('updateStats', xp, coins, username, myUserData.score, team, room);
  displayUserStats();
  // myUserData.score++;
  setTimeout(updates, 10000);
}

// Message from server
socket.on("messageTo", (message, toUser) => {
  // console.log(`Socket IO Message to: ${toUser}`, message);
  message.username = "BOT";
  if (toUser == username)
    outputMessage(message, null);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on("message", (message, replyTo) => {
  // console.log("Socket IO Message: ", message);

  if (blocked.indexOf(message.username) < 0)
    outputMessage(message, replyTo);
  else {
    message.msgText = "BLOCKED";
    outputMessage(message, replyTo);
  }

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function replySubmit(e, replyTo) {
  msgSubmit(e, replyTo);
}

function msgSubmit(e, replyTo) {
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
  if (replyTo == null)
    socket.emit("chatMessage", msg + "ßΓ" + nickname + "ßΓ" + team + "ßΓ" + xp, null);
  else
    socket.emit("replyMessage", "REPLY: (" + replyTo + ") " + msg + "ßΓ" + nickname + "ßΓ" + team + "ßΓ" + xp, replyTo);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
}

// Message submit
// chatForm.addEventListener("submit", (e) => {
//   msgSubmit(e);
// });

// Output message to DOM
function outputMessage(message, replyTo) {
  const div = document.createElement("div");
  div.id = message.username + "-" + message.time;
  div.classList.add("message");
  var topDiv = document.createElement("div"); //topDiv.classList.add("meta");
  // topDiv.style = "display: flex; align-items: flex-start;";
  div.appendChild(topDiv);
  const header = document.createElement("div"); topDiv.appendChild(header);
  header.classList.add("meta"); header.style += "margin-top: 10px; padding: 3px;";

  // console.log('message: ', message)
  //check for secret mode
  var uname //= document.createElement("strong");
  if (message.nckName == '')
    uname = "• " + message.username;
  else if (message.secretMode == 'on') {
    uname = "• " + message.nckName; // output nickname
  } else {
    // output username and nickname
    uname = "• " + message.username + " AKA " + message.nckName;
  }
  // Output the team and xp info
  if (message.username == "BOT") {
    header.innerHTML = `<div style="font-size: 12px; float: left; padding: 3px"> • CHATBOT  <i class="fas fa-clock"></i><span> <span>${" " + message.time} </span> </div>`;
  } else {
    header.innerHTML += `<div style="font-size: 12px; float: left; padding: 3px"> ${"• " + message.username}`
      + `<span style="color: black;font-size: 12px; padding: 3px;"> ${" Team: " + message.team}</span>`
      + `<span style="color: blue;font-size: 12px"> ${" XP: " + message.xp} </span>`
      + `<i class="fas fa-clock"></i><span style="font-size: 12px;"> ${" " + message.time} </span></div>`;
    // header.innerHTML += `<span><i class="fas fa-reply-all"></i> </span>`;
    // header.innerHTML += `<i class="fas fa-reply"></i>`;
  }

  //HANDLE REPLY
  var replyIcon = document.createElement("i");
  replyIcon.className = "fas fa-reply";
  replyIcon.addEventListener("click", () => {
    var cancelBtn = document.getElementById("cancelBtn");
    cancelBtn.style = "display: block";
    inputMsg.placeholder = "Replying to " + message.username + " AKA " + message.nickname;
    reply.action = true;
    reply.target = message.username;
    throttle = true;
  })

  // message text
  const para = document.createElement("div");
  const paratext = document.createElement("text");
  paratext.style = " margin: 0px; font-size: 12px;";
  if (replyTo != null) {
    console.log("replying to", replyTo)
    var replyIcon = document.createElement("i");
    replyIcon.className = "fas fa-reply";
    replyIcon.style = "padding: 5px";
    ///para.style = " margin: 0px 5px; display: flex;";
    para.append(replyIcon);
    para.id = message.username + "-" + message.time;
    para.appendChild(paratext);
    paratext.innerHTML += `<strong style="color:blue;"> REPLY: ${replyTo}: </strong>`;
  }
  paratext.innerHTML += `<strong> ${uname} </strong>`;
  paratext.innerText = message.msgText; //output the message text
  para.appendChild(paratext);

  const commentTbl = document.createElement("div");
  commentTbl.className = "chat-commentTbl";

  //add the video chat button
  if ( (username != message.username & message.username != "BOT") ) {
    const cmtJoinUserLive = document.createElement("div")
    const cmtJoinUserLiveIcon = document.createElement("i")
    cmtJoinUserLiveIcon.className = "fas fa-video";
    cmtJoinUserLive.id = "joinUserLive";
    cmtJoinUserLive.cmt = "color: grey;";
    cmtJoinUserLive.appendChild(cmtJoinUserLiveIcon);
    commentTbl.appendChild(cmtJoinUserLive);
    cmtJoinUserLive.addEventListener("click", function joinUserLive() {
      if (username != message.username & message.username != "BOT") {
        videoCallUser(message.username);
        console.log("joining user live");
      }
    })
  }

  //like and react in chat Button
  if (1) {
    const cmtTblDivLike = document.createElement("span");
    const cmtTblDivLikeNum = document.createElement("div");
    cmtTblDivLikeNum.innerText = "0"; cmtTblDivLikeNum.id = "like"; cmtTblDivLikeNum.style = " align-self: center;";
    const cmtTblDivLikeIconDIV = document.createElement("div");
    const cmtTblDivLikeIcon = document.createElement("i"); cmtTblDivLikeIcon.style = "color: grey;"; cmtTblDivLikeIcon.id = "likeIcon";
    cmtTblDivLikeIconDIV.append(cmtTblDivLikeIcon);
    cmtTblDivLikeIcon.className = "fas fa-thumbs-up";
    cmtTblDivLike.append(cmtTblDivLikeNum); cmtTblDivLike.append(cmtTblDivLikeIconDIV);
    cmtTblDivLike.style = "display: flex; color: grey;";

    const cmtTblDivHate = document.createElement("span");
    const cmtTblDivHateNum = document.createElement("div");
    cmtTblDivHateNum.innerText = "0"; cmtTblDivHateNum.id = "hate"; cmtTblDivHateNum.style = " align-self: center;";
    const cmtTblDivHateIconDIV = document.createElement("div");
    const cmtTblDivHateIcon = document.createElement("i");
    cmtTblDivHateIconDIV.append(cmtTblDivHateIcon); cmtTblDivHateIcon.style = "color: grey;"; cmtTblDivHateIcon.id = "hateIcon";
    cmtTblDivHateIcon.className = "fas fa-thumbs-down";
    cmtTblDivHate.append(cmtTblDivHateNum); cmtTblDivHate.append(cmtTblDivHateIconDIV);
    cmtTblDivHate.style = "display: flex; color: grey;";

    const cmtTblDivReact = document.createElement("div");

    commentTbl.appendChild(cmtTblDivReact);
    commentTbl.appendChild(cmtTblDivLike);
    commentTbl.appendChild(cmtTblDivHate);

    cmtTblDivLike.addEventListener("click", function like() {
      if (username != message.username) {
        // message.xp += 2;
        cmtTblDivLikeIcon.style.color = "green";
        console.log(`${username} liked ${message.username}'s comment`);
        socket.emit("chatVote", message.username, div.id, 'like');
        cmtTblDivLike.removeEventListener("click", like);
      }
    });

    cmtTblDivHate.addEventListener("click", function hate() {
      if (username != message.username) {
        // message.xp -= 1;
        cmtTblDivHateIcon.style.color = "red";
        console.log(`${username} hated ${message.username}'s comment`);
        socket.emit("chatVote", message.username, div.id, 'hate');
        cmtTblDivHate.removeEventListener("click", hate);

      }
    });

    header.appendChild(commentTbl);
  }

  //Tip in chat Button
  if (username != message.username) {
    const coinBtn = document.createElement("div");
    // coinBtn.innerText = "+1";
    const coin = document.createElement("i");
    coin.className = "fas fa-coins";
    coin.style = "font-size:16px; color:silver;";
    // coinBtn.type = "submit";
    coinBtn.appendChild(coin);
    commentTbl.appendChild(coinBtn);

    coinBtn.addEventListener("mouseleave", function () {
      coin.style = "font-size:16px; color:silver;"
    });
    coinBtn.addEventListener("mouseover", function () {
      coin.style = "font-size:16px; color:gold;"
    });
    coinBtn.addEventListener("click", function () {
      if (username != message.username) {
        tipUsers(username, message.username, 1);
        // console.log(`${username} Tipped ${message.username}`);
        socket.emit("chatMessageTo", `$$$ ${username} Tipped ${message.username} $$$`, message.username);

      }
    });
  }

  //Follow in chat Button
  if (username != message.username & message.username != "BOT") {
    //add friend
    const friendBtn = document.createElement("div");
    const friendIcon = document.createElement("i");

    if (friendsList.length > 0) {
      //tdFriend.append(friendObj);
      for (const [index, val] of friendsList.entries()) {
        // friendsList.forEach((item, indx) => {
        if (message.username == val) {
          friendIcon.className = "fas fa-check";
          //console.log(val, " is followed");
          break;
        } else {
          friendIcon.className = "fas fa-plus-square";
          //console.log(val, " is not followed");
        }
      }
    } else {
      friendIcon.className = "fas fa-plus-square";
    }

    friendIcon.style = "font-size:16px;color:green;padding-right: 5px;";
    friendIcon.name = "friend";
    friendBtn.appendChild(friendIcon);
    commentTbl.appendChild(friendBtn);

    friendBtn.addEventListener("click", function () {
      if (username != message.username) {
        addFriend(username, message.username, friendIcon.className);
        console.log(`${username} followed ${message.username}`);
        socket.emit("chatMessageTo", `${username} started following ${message.username}`, message.username);
      }
    });
  }

  //Block in chat Button
  if (username != message.username & message.username != "BOT") {
    //block
    const blockBtn = document.createElement("div");
    const block = document.createElement("i");
    block.className = "fas fa-ban";
    block.style = "font-size:16px; color:red; padding: 5px;";


    blockedList.forEach((item, index) => {
      if (message.username == item)
        block.style = "font-size:16px; color:grey; padding: 5px;";
    })

    blockBtn.appendChild(block);

    commentTbl.appendChild(blockBtn);

    blockBtn.addEventListener("click", function () {
      if (username != message.username) {
        addFriend(username, message.username, friendIcon.className);
        console.log(`${username} blocked ${message.username}`);
        socket.emit("chatMessageTo", `${username} has blocked you, try to be less annoying.`, message.username);
      }
    });
  }

  //deleteIcon chatbox Button
  if (1) {
    //deleteIcon
    const deleteIconBtn = document.createElement("div");
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash";
    deleteIcon.style = "font-size:16px;color:blue;";
    // deleteIcon.onclick = deleteIconUser();
    deleteIconBtn.appendChild(deleteIcon);

    commentTbl.appendChild(deleteIconBtn);

    deleteIconBtn.addEventListener("click", function () {
      div.remove();
    });
  }

  // handles replying to messages
  if (1) {
    var reply = { action: false, target: "" }
    var throttle = false;

    var inputMsg = document.getElementById("msg");
    var submitBtn = document.getElementById("submitBtn");
    var cancelBtn = document.getElementById("cancelBtn");
    inputMsg.addEventListener("keydown", () => {
      if (inputMsg.value != "") {
        cancelBtn.style = "display: block";
      } else {
        cancelBtn.style = "display: none";
      }
    })

    cancelBtn.addEventListener("click", () => {
      cancelBtn.style = "display: none";
      inputMsg.value = ''; reply.action = false;
    })

    submitBtn.addEventListener("click", () => {
      cancelBtn.style = "display: none";
    })

    chatForm.addEventListener("submit", (e) => {
      inputMsg.placeholder = "Enter Message...";
      if (reply.action == true)
        replySubmit(e, reply.target);
      else
        msgSubmit(e, null);
      reply.action = false;
    });


    div.addEventListener('click', function (evt) {
      // var o = this,
      // ot = this.textContent;
      if (!throttle && evt.detail === 3) {
        // this.textContent = 'Triple-clicked!';

        var cancelBtn = document.getElementById("cancelBtn");

        cancelBtn.style = "display: block";
        inputMsg.placeholder = "Replying to " + message.username + " AKA " + message.nickname;
        reply.action = true;
        reply.target = message.username;
        throttle = true;
        setTimeout(function () {
          // o.textContent = ot;    
          throttle = false;
        }, 1000);
      }
    });
  }

  let tbl = document.createElement("table")
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  tbl.appendChild(thead)
  tbl.appendChild(tbody)
  div.appendChild(tbl)
  thead.appendChild(topDiv);
  tbody.appendChild(para)
  document.querySelector(".chat-messages").appendChild(div);
}

// Display the teasm button table
function teamsDisplay() {
  var teamBox = document.getElementById("teamnames");
  var teams = JSON.parse(teamBox.innerText);
  teamBox.innerText = '';
  var tbl = document.createElement("table");
  var thead = document.createElement("thead");
  var tbody = document.createElement("tbody");
  let th1 = document.createElement("th");
  let th2 = document.createElement("th");
  let th3 = document.createElement("th");
  th1.innerHTML = `<strong>TeamName</strong>`;
  th2.innerHTML = `<strong>Score</strong>`;
  th3.innerHTML = `<strong>+</strong>`;
  thead.appendChild(th1);
  thead.appendChild(th2);
  thead.appendChild(th3);
  tbl.appendChild(thead)

  teams.forEach((item, index) => {
    //console.log(`teams Obj: ${index}. ${item}`);
    // let score = Math.ceil(Math.random() * 1000);
    scores[item] = 0;
    let tr = document.createElement("tr");
    let tdName = document.createElement("td");
    let tdScore = document.createElement("td");
    tdScore.id = item + "#Score";
    let tdBtn = document.createElement("td");

    var btn = document.createElement("button");
    btn.id = "join" + item + "Team";
    btn.innerText = "Join";
    btn.style = "padding: 0px 5px; color: black;";
    btn.addEventListener("click", () => {
      team = item;
      tipUsers(username, "BOT", roomJSON[0]["joinCost"]);
      socket.emit("setStreamJoinConfig", username, item, 30, room, "FFF", teams); //item = team
    })

    tdName.innerText = item;
    tdScore.innerHTML = `<strong>${scores[item]}</strong>`;
    tdBtn.append(btn);
    tr.appendChild(tdName);
    tr.appendChild(tdScore);
    tr.appendChild(tdBtn);
    tbody.appendChild(tr)
  });
  tbl.appendChild(tbody);
  tbl.style = "margin: auto;";
  teamBox.appendChild(tbl);
}

// Add room name to DOM
function displayUserStats() {
  try {


    // if (myUserData.score != null)
    //   UserStats.innerText = "XP: " + xp + " / Coins: " + coins + " / Score: " + myUserData.score;
    // else
    UserStats.innerText = "XP: " + xp + " / Coins: " + coins;
    // teams.forEach((item, index) => {
    //   let teamScore = document.getElementById(item + "#Score")
    //   teamScore.innerText = scores[item];
    // })
  } catch { }
}

// Add users to DOM table
// this supposed to code for the add friend table
function outputUsers(users) {
  userList.innerHTML = "";
  // console.log("Output Users: ", users);
  users.forEach((user) => {

    const tr = document.createElement("tr");
    const tdName = document.createElement("td"); const tdBlock = document.createElement("td"); const tdFriend = document.createElement("td"); const tdTip = document.createElement("td");
    if (user.username == userJSON[0].username) {
      const tdName = document.createElement("td"); const tdBlock = document.createElement("td"); const tdFriend = document.createElement("td"); const tdTip = document.createElement("td");
      tdName.innerText = user.username;
      // const tr = document.createElement("tr");
      tr.appendChild(tdName);
      tr.appendChild(tdTip);
      tr.appendChild(tdFriend);
      tr.appendChild(tdBlock);
      userList.appendChild(tr);

    } else {
      //name
      const tdName = document.createElement("td");
      tdName.innerText = user.username;
      tr.appendChild(tdName);

      //tip
      if (1) {
        const tdTip = document.createElement("td");
        const coinBtn = document.createElement("div");
        // coinBtn.innerText = "+1";
        const coin = document.createElement("i");
        coin.className = "fas fa-coins";
        coin.style = "font-size:24px;color:gray;padding: 2px;";
        // coin.onclick = tipUsers();
        coinBtn.type = "submit";
        coinBtn.appendChild(coin);
        tdTip.appendChild(coinBtn);
        tr.appendChild(tdTip);

        tdTip.addEventListener("click", function () {
          alert("Tip me");
          if (username != tdName.innerText) {
            tipUsers(username, tdName.innerText, 1);
            console.log(`${username} Tipped ${tdName.innerText}`);
          }
        });

      }

      //add friend
      if (1) {
        const tdFriend = document.createElement("td");
        const friendBtn = document.createElement("div");
        const friendIcon = document.createElement("i");
        friendBtn.type = "submit";

        if (friendsList.length > 0) {
          //tdFriend.append(friendObj);
          for (const [index, val] of friendsList.entries()) {
            // friendsList.forEach((item, indx) => {
            if (user.username == val) {
              friendIcon.className = "fas fa-check";
              //console.log(val, " is followed");
              break;
            } else {
              friendIcon.className = "fas fa-plus-square";
              //console.log(val, " is not followed");
            }
          }
        } else {
          friendIcon.className = "fas fa-plus-square";
        }

        friendIcon.style = "font-size:24px;color:green;padding: 2px;";
        friendIcon.name = "friend";

        friendBtn.appendChild(friendIcon);
        tdFriend.appendChild(friendBtn);


        tdFriend.addEventListener("click", function () {
          addFriend(username, tdName.innerText, friendIcon.className);
        });

        tr.appendChild(tdFriend);
      }

      //Add block button
      if (1) {
        const tdBlock = document.createElement("td");
        const blockBtn = document.createElement("div");
        const block = document.createElement("i");
        block.className = "fas fa-ban"; block.style = "font-size:24px;color:red;padding: 2px;";

        blockedList.forEach((item, index) => {
          if (user.username == item)
            block.style = "font-size:24px;color:grey;padding: 2px;";
        })

        blockBtn.type = "submit";
        blockBtn.appendChild(block);
        tdBlock.appendChild(blockBtn);

        tdBlock.addEventListener("click", function () {
          blockUser(tdName.innerText, room, username);
        });

        tr.appendChild(tdBlock);
      }

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

async function tipUsers(currentUser, userToTip, coins) {
  // var payload = {
  //   "currentUser": currentUser,
  //   "userToTip": userToTip,
  // };
  // postData("http://localhost:3000/tip", payload);
  socket.emit('Tip', currentUser, userToTip, coins);
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

setTimeout(updates, 1000);
// updates();
teamsDisplay();