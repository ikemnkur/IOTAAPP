
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
const team = document.getElementById("team").innerText;
const room = roomJSON[0]["roomID"];
const topic = roomJSON[0]["topic"];

var secretMode = document.getElementById("secretMode").innerText;
var coins = userJSON[0].coins;
var xp = userJSON[0].xp;
var friendsList = JSON.parse(userJSON[0].friends);
const blocked = userJSON[0].blockedUsers;
var activeUsers;

var colors = ["green", "cyan", "pink", "gold", "agua", "red", "thistle", "lightcyan", "salmon", "crismon", "springgreen", "sykblue", "seagreen", "greenyellow", "fuschia", "lavender", "magenta"]
var focusedStyle = "background: radial-gradient(#ac1b1b, transparent);"
const socket = io({
  transports: ["websocket"], pingInterval: 1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3
});
console.log("app start")
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

function updates() {
  socket.emit('updateStats', xp, coins, username);
  displayUserStats();
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
    header.innerHTML += `<div style="float: left;"><span style="color: black;font-size: 12px; padding: 3px;"> ${" Team: " + message.team}</span>`
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
  paratext.innerHTML += `<strong style="color:blue;"> ${uname}: </strong>`;
  paratext.innerText = message.msgText; //output the message text
  para.appendChild(paratext);

  const commentTbl = document.createElement("div");
  commentTbl.className = "chat-commentTbl";

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
  th1.innerHTML = `<strong>Team Name</strong>`;
  th2.innerHTML = `<strong>Score</strong>`;
  th3.innerHTML = `<strong>+</strong>`;
  thead.appendChild(th1);
  thead.appendChild(th2);
  thead.appendChild(th3);
  tbl.appendChild(thead)

  teams.forEach((item, index) => {
    //console.log(`teams Obj: ${index}. ${item}`);
    let score = Math.ceil(Math.random() * 1000);;
    let tr = document.createElement("tr");
    let tdName = document.createElement("td");
    let tdScore = document.createElement("td");
    let tdBtn = document.createElement("td");
    var btn = document.createElement("button");
    btn.id = "join" + item + "Team";
    btn.innerText = "Join"; btn.style = "padding: 0px 5px; color: black;";
    btn.addEventListener("click", () => {
      tipUsers(username, "BOT", roomJSON[0]["joinCost"]);
      socket.emit("setStreamJoinConfig", username, item, 30, room); //item = team
    })
    tdName.innerText = item;
    tdScore.innerHTML = `<strong>${score}</strong>`;
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
  if (myUserData.score != null)
    UserStats.innerText = "XP: " + xp + " / Coins: " + coins + " / Score: " + myUserData.score;
  else
    UserStats.innerText = "XP: " + xp + " / Coins: " + coins;
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

// video part


const videoSocket = io('/');

const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')
const myCanvas = document.createElement('canvas')
myVideo.muted = true
var action = "change";
var peers = {} //const peers = {};
var streams = {};
var socketid = "";
var mode = 0, posX = 0;
var ROOM_ID = roomJSON[0]["roomID"];
var userID = username;
var focusedCanvas, imgSentToCanvas;
var currentCall = {};
var myUserData;
var peer;
var canJoin = false, timer = 60; // for the temporary stream join
var OUD = {};
var Room = {};
var streamers = {}

videoSocket.on("connect", () => {
  console.log(`you connected with socket.id ${videoSocket.id}`);
  socketid = videoSocket.id;

  myUserData = {
    "id": socketid,
    "name": userID,
    "userTeam": team, // gets this from the modal.html 
    "XP": userJSON[0]["xp"],
    "peerId": null,
    "HP": 100,
    "streaming": false,
    "score": 0,
    "coins": userJSON[0]["coins"],
  };

  peer = new Peer(userID, {
    // get the peerjs server info
    host: '/', //localhost:3001
    port: '3001',
  });


  peer.on('open', (id) => {

    console.log('Peer Open Id: ', id);
    myUserData.id = socketid;
    myUserData.peerId = id;

    videoSocket.emit('connectNewStream', ROOM_ID, id, myUserData); //Set up socket.io

    // Answering A Call
    // When a call is made to our UUID, we receive a call event on our peer object, we can then ask the user if they want to accept the call or not. If they accept the call, we need to grab the user’s video and audio inputs, and send those to the caller. If the call is rejected, we can close the connection.

    peer.on("call", (call) => {
      console.log(" Accept call from peer: ", call.peer)
      var user //= getUserDatabyUserId(call.peer)
      // if 
      // (confirm(`Accept call from ${call.peer}?`)) //{
      // delay(500);

      Room.forEach((item, index) => {
        if (item.streaming == true) {
          if (item.name == call.peer)
            user = item;
        }
      })
      // if (user.streaming) {
      if (1) {

        // grab the camera and mic
        // navigator.mediaDevices
        //   .getUserMedia({ video: true, audio: true })
        //   .then((GUMstream) => {
        //Take stream from setting and use it to call others
        const stream = document.getElementById("video").srcObject;
        // answer the call
        call.answer(stream);
        //remove the preview stream
        // document.getElementById('video').style.display = "none";
        // save the close function
        currentCall[call.peer] = call;
        // The end stream timer, kick user off stream after X seconds
        setTimeout(endCall(call.peer), timer * 1000);
        // change to the video view
        call.on("stream", (remoteStream) => {
          // add a certain stream
          var video = document.createElement('video');
          var canvas = document.createElement("canvas");
          var userdata = getUserDatabyUserId(call.peer)
          let title = "video#" + call.peer;
          console.log("received the remote stream from peer: ", call.peer);
          if (document.getElementById(title) == null) {
            addOtherVideoStream(video, remoteStream, userdata, canvas);
          }

        });
      } else {
        // user rejected the call, close it
        call.close();
        console.log("call rejected from: ", call.peer);
      }
    });
  })
})


async function callUser(userDATA) {
  // get the id entered by the user
  // const peerId = document.querySelector("input").value;
  let peerID = userDATA.peerId;
  // grab the camera and mic
  // const stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  // });
  const stream = document.getElementById("video").srcObject;

  // make the call to recieve
  if (peerID != userID)
    var call = peer.call(peerID, stream);
  else
    var call = undefined;

  if (call != undefined) {
    console.log("successful call from: ", call.peer);
    streamers[userDATA.name] = userDATA.streaming
    // if (peerID == userID) { //Add user own stream to DOM elements
    //   addSelfVideoStream(stream, userDATA);
    //   console.log("added own stream");
    // }
    call.on("stream", (stream) => {
      console.log("peerJS received a stream from: ", call.peer)
      // var video = document.createElement('video');
      // var canvas = document.createElement("canvas");
      // addOtherVideoStream(video, stream, userDATA, canvas);
      let title = "video#" + call.peer;
      if (document.getElementById(title) == null || 1) { //check for duplicates
        // when we receive the remote stream, play it
        let div = document.createElement("div");
        let video = document.createElement("video");
        let header = document.createElement("header");
        header.innerText = title;
        video.id = title;
        video.srcObject = stream;
        video.play();
        let livefeedDiv = document.getElementById("videoTable");
        div.appendChild(header);
        div.appendChild(video);
        livefeedDiv.appendChild(div);
      }
    });
    call.on("data", (stream) => {
      console.log("peerJS received a (data) stream from: ", call.peer)
      // var video = document.createElement('video');
      // var canvas = document.createElement("canvas");
      // addOtherVideoStream(video, stream, userDATA, canvas);
      let title = "video#" + call.peer;
      if (document.getElementById(title) == null || 1) { //check for duplicates
        // when we receive the remote stream, play it
        let div = document.createElement("div");
        let video = document.createElement("video");
        let header = document.createElement("header");
        header.innerText = title;
        video.id = title;
        video.srcObject = stream;
        video.play();
        let livefeedDiv = document.getElementById("videoTable");
        div.appendChild(header);
        div.appendChild(video);
        livefeedDiv.appendChild(div);
      }
      // document.querySelector("#remote-video").srcObject = stream;
    });
    call.on("error", (err) => {
      console.log(err);
      streamers[userDATA.name] = false;
      console.log("error with call for peer: ", call.peer);
    });
    call.on('close', () => {
      console.log("call closed for peer: ", call.peer);
      streamers[userDATA.name] = false;
      endCall(call.peer)
    });
    // save the close function
    currentCall[call.peer] = call;
  } else {
    console.log("call failed for peer: ", peerID);
    addSelfVideoStream(stream, myUserData);
    // let title = "video#" + call.peer;
    // let div = document.createElement("div");
    // let video = document.createElement("video");
    // let header = document.createElement("header");
    // header.innerText = title;
    // video.id = title;
    // video.srcObject = stream;
    // video.play();
    // let livefeedDiv = document.getElementById("videoTable");
    // div.appendChild(header);
    // div.appendChild(video);
    // livefeedDiv.appendChild(div);
  }

}



function updateRoom() {
  if (Room[0].peerId == userID) {
    videoSocket.emit("askForRoomUpdate", ROOM_ID);
  }
  myUserData.coins = coins; // get coins value from Chat.js
  myUserData.score++;
  videoSocket.emit("sendUserStatus", ROOM_ID, myUserData);

  setTimeout(updateRoom, 5000);
}

// Get current user
function getUserDatabyUserId(id) {
  return Room.find(user => user.name === id);
}

videoSocket.on("streamJoinConfig", (userid, team, time, room) => {
  console.log("Stream Join event: ", userid, "in room: ", room);
  if (userid == userID & room == ROOM_ID) {
    timer = time;
    console.log("Set timer to ", time, " seconds for user: ", userid);
    canJoin = true;
    myUserData.userTeam = team;
    myUserData.streaming = true;// this is the problem
    // delay(5000)
  }
  setTimeout(() => {
    callUser(getUserDatabyUserId(userid));
  }, 6000);
})


// //emitting from app.js when 
videoSocket.on('userConnected', (roomData, roomID, otherUserData) => {
  if (roomID == ROOM_ID) { //& otherUserData.name != userID) {
    console.log(`Connect Event RM: ${roomID} (peerId): `, otherUserData.peerId);
    // Set and fetch the active user list
    OUD = otherUserData; // console.log("other user data: ", OUD);
    // console.log("Incoming Stream", stream);
    Room = roomData;
    streamers[otherUserData.name] = false;
    // console.log("AUV: ", Room);
    // connectToNewUser(otherUserData.peerId, otherUserData.streamObj, OUD);
    // Room.forEach((item, index) => {
    //   if (document.getElementById("video#" + item.userId) == null){
    //     callUser(item);
    //     console.log("adding video for ", item);
    //   }

    // })
    // callUser(otherUserData);
  }
})

// Ending The Call
// When the call is over the user can click the `End call` button to terminate the connection. Then, we can show the menu once again.

function endCall(peerid) {
  // // If there is no current call, return
  if (!currentCall[peerid]) return;
  // Close the call, and reset the function
  try {
    currentCall[peerid].close();
  } catch { }
  currentCall[peerid] = undefined;
  myUserData.streaming = false;
}

async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


videoSocket.on('user-disconnected', (peerId, data, roomid, userdata) => {
  console.log("Disconnect Event (peerId): ", userdata.name);
  Room = data;
  try {
    let videoDiv = document.getElementById("video#" + peerId)
    if (videoDiv.parentElement != null)
      videoDiv.parentElement.remove();
  } catch (e) {
    console.log(e);
  }

  if (peers[peerId]) {
    peers[peerId].close();
    console.log("User disconnected, live users: ", Room);
    console.log("Active Peer JS connections: ", peers);
  }
});

videoSocket.on('getActiveUsers', (roomID, data) => { // get the active user in the current room

  if (roomID == ROOM_ID) {
    console.log("got room update");
    Room = data;
    // console.log("live users recieved: ", Room);
    Room.forEach((item, index) => {
      // console.log();
      if (item.streaming == true) {
        if (streamers[item.name] == false) {
          if (document.getElementById("video#" + item.name) == null) {
            console.log("adding video for ", item.name);
            callUser(item);
          }
        }
      }
    })
  }
});

setTimeout(updateRoom, 5000);

var showsettings = 1;
document.getElementById("settingsBtn").addEventListener("click", () => {
  var setting = document.getElementById("settings")
  if (showsettings) {
    setting.style.display = "none";
    showsettings = 0;
  } else {
    setting.style.display = "block"
    showsettings = 1;
  }
})

// function connectToNewUser(peerId, userVideoStream, otherUserData) { //setup connection stream to new user

//   console.log('connectToNewUser Obj: ', peerId);
//   var video = document.createElement('video');
//   var canvas = document.createElement("canvas");
//   addOtherVideoStream(video, userVideoStream, otherUserData, canvas)

// };


function addSelfVideoStream(stream, userData) { //Draw video to canvas element then append that to the DOM
  // var uname = userData.name; 
  // var userTeam = userData.userTeam;

  var video = document.createElement('video');
  var canvas = document.createElement("canvas");

  video.srcObject = stream


  // console.log("User Data Json: ", userData);

  // console.log("User ", uname, " has joined team: ", userTeam);

  canvas.addEventListener("click", () => {
    focusedCanvas = canvas.id;
    console.log("focusedCanvas = ", canvas.id);
  });

  canvas.id = 'canvas#' + userID;
  let w = 300, h = 220;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w;
  canvas.style.height = h;
  var context = canvas.getContext('2d');

  video.id = "video#" + userID;
  // video.srcObject = stream

  video.addEventListener('loadedmetadata', () => {
    console.log("User " + userID + "'s Video play event. ");
    video.play();
  })

  // changed
  video.addEventListener('play', function () {
    draw(this, context, 300, 230, canvas.id, userData);
  }, false);

  // var otherUserTeam = document.createElement("h2");
  // otherUserTeam.id = uname + "#Teamlabel";
  // otherUserTeam.innerText = userTeam;
  // var otherUsername = document.createElement("h3");
  // otherUsername.innerText = uname;
  // var d = document.createElement("div");
  // d.appendChild(otherUserTeam);
  // d.appendChild(otherUsername);

  var tbl = document.getElementById("videoTable");
  var tdc = document.createElement("td");
  tbl.appendChild(tdc);
  // tdc.appendChild(d);
  tdc.appendChild(video);
  tdc.appendChild(canvas);

  // videoGrid.append(video)
  // videoGrid.append(canvas)
}

function addOtherVideoStream(video, stream, userData, canvas) { //Draw video to canvas element then append that to the DOM
  var uname = userData.name, userTeam = userData.userTeam;

  video.srcObject = stream

  console.log("User Data Json: ", userData);

  console.log("User ", uname, " has joined team: ", userTeam);

  if (document.getElementById('canvas#' + userData.peerId) != null)
    return 0;

  canvas.addEventListener("click", () => {
    focusedCanvas = canvas.id;
    console.log("focusedCanvas = ", canvas.id);
  });

  canvas.id = 'canvas#' + userData.peerId;
  let w = 300, h = 220;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w;
  canvas.style.height = h;
  var context = canvas.getContext('2d');

  video.id = "video#" + uname;

  video.addEventListener('loadedmetadata', () => {
    console.log("User " + uname + "'s Video play event. ");
    video.play();
  })

  // changed
  video.addEventListener('play', function () {
    draw(this, context, 300, 230, canvas.id, userData);
  }, false);

  var tbl = document.getElementById("videoTable");
  var tdc = document.createElement("td");
  tbl.appendChild(tdc);
  // tdc.appendChild(d);
  tdc.appendChild(video);
  tdc.appendChild(canvas);

  // videoGrid.append(video)
  // videoGrid.append(canvas)
}

//added these functions below
function draw(video, context, width, height, id, userData) {
  // if (video.id == "remote-video") {
  var canvas = document.getElementById(id);
  var ctxt = canvas.getContext('2d');
  ctxt.drawImage(video, 0, 0, width, height);
  if (action == "change") {
    redShape(canvas);
  } else {
    Circle(canvas);
  }
  // var hold = false;
  // canvas.addEventListener("click", () => {
  //   if (hold == false) {
  //     focusedCanvas = canvas.id;
  //     console.log("focusedCanvas = ", canvas.id)
  //     canvas.removeEventListener("click", () => { });
  //   }
  //   setTimeout(() => { hold = true }, 200)
  // })
  drawHUD(canvas, userData);
  if (imgSentToCanvas != null)
    imgSentToCanvas.update();
  // var img = document.getElementById(id);
  var myGamePiece = new component(30, 30, "../images/smiley.gif", 100 + posX / 2, 120, "image", canvas);
  myGamePiece.update();
  setTimeout(draw, 10, video, context, width, height, id, userData);

}

function drawHUD(canvas, userData) {
  //var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  let len = userData.name.length;

  context.strokeStyle = '#003300';
  context.font = '16px Arial';
  context.fillText(userData.userTeam, (canvas.width / 2) - (6 * len), 25);

  context.font = '12px Arial';
  context.strokeStyle = '#303300';

  context.fillText(userData.name, 10, 24);
}

function Circle(canvas) {
  //var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2 + posX;
  var centerY = canvas.height / 2 + 50 * Math.sin(posX / 10);
  var radius = 10;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'green';
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = '#003300';
  context.stroke();

  if (mode == 0) {
    posX--;
  }
  else if (mode == 1) {
    posX++;
  }

  if (posX > 100) {
    mode = 0;
  }
  if (posX < -100) {
    mode = 1;
  }

}

function redShape(canvas) {
  //var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2 + posX;
  var centerY = canvas.height / 2 + 50 * Math.sin(posX / 20);
  var radius = 20;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'red';
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = '#003300';
  context.stroke();

  if (mode == 0) {
    posX--;
  }
  else if (mode == 1) {
    posX++;
  }


  if (posX > 100) {
    mode = 0;
  }
  if (posX < -100) {
    mode = 1;
  }

}

function component(width, height, color, x, y, type, canvas) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = canvas.getContext('2d');
    if (type == "image") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

if (1) {

  var search = document.getElementById("imgSearch");
  // var searchBtn = document.getElementById("searchBtn");
  var searchForm = document.getElementById("searchForm");
  var fullImgList = {}; // list of imgs

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("searching....");
    if (fullImgList.length == undefined)
      videoSocket.emit("fetchImages", ROOM_ID, userID);
    else
      previewImg(search.value);
  });

  // searchBtn.addEventListener("click", () => {
  //   videoSocket.emit("fetchImages", (ROOM_ID, username));
  // });

  videoSocket.on("fetchImgList", (data) => {
    fullImgList = data;
    previewImg(search.value);
  })

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function previewImg(searchTerm) {
    var imagePrevDiv = document.getElementById("imgPrevDiv");
    if (searchTerm.length >= 3) {
      var targetCanvas = document.getElementById(focusedCanvas);
      let matches, cntrCvnX = 125 - 8, cntrCvnY = 150 - 16;

      if (modeToggle == "library") {
        matches = searchLibrary(searchTerm, "images");
      } else {
        matches = searchImages(searchTerm);
      }

      if (focusedCanvas == null) {
        focusedCanvas = myCanvas.id;
        targetCanvas = document.getElementById(focusedCanvas);
      } else {
        if (targetCanvas != null) {
          console.log("Focused on Canvas: ", targetCanvas);
          cntrCvnX = targetCanvas.width / 2 - 32;
          cntrCvnY = targetCanvas.height / 2 - 32;
        }

      }

      removeAllChildNodes(imagePrevDiv);
      matches.forEach(match => {
        if (match != null) {
          // var imageP = document.getElementById("previewImg").src =`../images/${match}` ;
          if (modeToggle == "library") {
            var image = match;
            image.height = 64;
            image.width = 64;
            imagePrevDiv.appendChild(image);
            image.style = "padding: 2px"
            image.addEventListener("click", () => {
              console.log("adding image to from Library to screen: ", image);
              imgSentToCanvas = new component(64, 64, `${image.src}`, cntrCvnX, cntrCvnY, "image", targetCanvas);
              imgSentToCanvas.update();
            })
          } else {
            var image = document.createElement("img");
            image.src = `../images/${match}`;
            image.height = 64;
            image.width = 64;
            imagePrevDiv.appendChild(image);
            image.style = "padding: 2px"

            image.addEventListener("dblclick", () => {
              console.log("adding image to target canvas: ", targetCanvas);
              imgSentToCanvas = new component(64, 64, `${image.src}`, cntrCvnX, cntrCvnY, "image", targetCanvas);
              imgSentToCanvas.update();
            })
            image.addEventListener("click", () => {
              console.log("adding image to library: ", image);
              library["images"].push(image);
            })
          }
        }
      });
    } else {
      let errorMSG = document.createElement("strong")
      errorMSG.innerText = "Type more than 3 characters to start search";
      imagePrevDiv.appendChild(errorMSG)
      // delay(1000);
      // errorMSG.remove();
    }
  }
  // JavaScript code
  function searchLibrary(search, type) {
    // var search = document.getElementById("imgSearch").value;
    // let search = document.getElementById('searchbar').value
    search = search.toLowerCase();
    // let x = document.getElementsByClassName('rooms');
    let x = library[type];
    var matches = [];
    // console.log("searching for: ", search, " in ", fullImgList);
    for (i = 0; i < x.length; i++) {
      if (x[i].src.toLowerCase().includes(search)) {
        // x[i].style.display = "none";
        matches.push(x[i]);
        // x[i].style.display = "";
      }
    }
    console.log("Matching Search Results: ", matches)
    if (matches != null) {
      return matches;
    } else {
      return null;
    }
  }

  // JavaScript code
  function searchImages(search) {
    // var search = document.getElementById("imgSearch").value;
    // let search = document.getElementById('searchbar').value
    search = search.toLowerCase();
    // let x = document.getElementsByClassName('rooms');
    let x = fullImgList;
    var matches = [];
    // console.log("searching for: ", search, " in ", fullImgList);
    for (i = 0; i < x.length; i++) {
      if (x[i].toLowerCase().includes(search)) {
        // x[i].style.display = "none";
        matches.push(x[i]);
        // x[i].style.display = "";
      }
    }
    console.log("Matching Search Results: ", matches)
    if (matches != null) {
      return matches;
    } else {
      return null;
    }
  }

  var library = {};
  library["images"] = [];

  var modeToggle = "search";
  var modeToggleBtn = document.getElementById("searchMode")
  var addBtn = document.getElementById("addToLibBtn")

  modeToggleBtn.addEventListener("click", () => {
    var imagePrevDiv = document.getElementById("imgPrevDiv");
    var imgSearchBar = document.getElementById("imgSearch");

    if (modeToggle == "search") {
      modeToggle = "library";
      modeToggleBtn.innerText = "Library";
      removeAllChildNodes(imagePrevDiv);
      imgSearchBar.placeholder = "Search Your Library";
      if (library["images"] != []) {
        library["images"].forEach(img => {
          imagePrevDiv.append(img);
        });
      }
      imgSearchBar.value = "";
      delay(500);
    } else {// (modeToggle == "library") {
      modeToggle = "search";
      imgSearchBar.placeholder = "Search For Images";
      modeToggleBtn.innerText = "Find";
      imgSearchBar.value = "";
      removeAllChildNodes(imagePrevDiv);
    }
    delay(100);
  })

  // addBtn.addEventListener("click", () => {

  // })
}