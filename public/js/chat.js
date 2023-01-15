// const { delay } = require("bluebird");
async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

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
var teams;
try {
  teams = JSON.parse(document.getElementById("teamnames").innerText);
} catch (error) {
  teams = document.getElementById("teamnames").innerText.split(",");
}

const room = roomJSON[0]["roomID"];
const topic = roomJSON[0]["topic"];

var secretMode = document.getElementById("secretMode").innerText;
var coins = userJSON[0].coins;
var xp = userJSON[0].xp;

var score = 0, scores = [];

teams.forEach((item, index) => {
  if (scores[index] == null) {
    scores[index] = 0;
  }
})


try {
  var friendsList = JSON.parse(userJSON[0].friends);
} catch (error) {
  var friendsList = userJSON[0].friends.split(",");
}
try {
  var blocked = userJSON[0].blockedUsers;
} catch (error) {
  // const blocked = userJSON[0].blockedUsers;
}

var activeUsers;

var colors = ["green", "cyan", "pink", "gold", "agua", "red", "thistle", "lightcyan", "salmon", "crismon", "springgreen", "sykblue", "yellowgreen", "fuschia", "greenyellow", "lavender", "magenta"]
var focusedStyle = "background: radial-gradient(#ac1b1b, transparent);"
const socket = io({
  transports: ["websocket"], pingInterval: 1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3
});

// Join chatroom
socket.emit("joinRoom", { username, nickname, coins, xp, room, secretMode, team, score, teams });

// Get room and users
socket.on("roomUsers", ({ roomname, users }) => {
  if (roomname == room) {
    activeUsers = users;
    displayUserStats();
    outputUsers(users);
  }

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
    if (vote == "unlike") {
      var upvotes = document.getElementById(msg_ID).querySelector('#like');
      upvotes.innerText = parseInt(upvotes.innerText) - 1;
      if (msg_username == username)
        xp -= 2;
    }
    if (vote == "hate") {
      var downvotes = document.getElementById(msg_ID).querySelector('#hate');
      downvotes.innerText = parseInt(downvotes.innerText) + 1;
      if (msg_username == username)
        xp -= 1;
    }
    if (vote == "unhate") {
      var downvotes = document.getElementById(msg_ID).querySelector('#hate');
      downvotes.innerText = parseInt(downvotes.innerText) - 1;
      if (msg_username == username)
        xp += 1;
    }
  }
});

// if ()
socket.emit("startScoreKeeping", room, teams)

socket.on("Scores", (roomName, scoreData) => {
  if (room == roomName) {
    console.log("Scores Event: ", scoreData[room])

    scoreData[room].forEach((item, index) => {
      scores[index] = item;
    })

    teams.forEach((item, index) => {
      // update score text in the scoreboards
      var teamScore = document.getElementById(`${item}#Score`)
      teamScore.innerText = scores[index]

      if (scores[index] > 999)
        resetScores(item);
    })
  }
});

setTimeout(addToScore, 10000);

var team2addScoreTo = 0;
teams.forEach((item, index) => {
  if (team == item)
    team2addScoreTo = index;
})
function addToScore() {
  console.log("adding to score");
  socket.emit("incrementScore", 1, team2addScoreTo, room)
  setTimeout(addToScore, 10000)
}

function resetScores(winningTeam) {
  alert(`${winningTeam} has won this round`)
  socket.emit("resetScores", room);
  activeUsers.forEach((item, index) => {
    if (item.team == winningTeam) {
      console.log("adding coins to " + item.username + "for winning round")
    }
  })
}

function updates() {
  socket.emit('updateStats', xp, coins, username, 50, team, room);
  // socket.emit('updateStats', xp, coins, username, myUserData.score, team, room);
  displayUserStats();
  // myUserData.score++;
  setTimeout(updates, 10000);
}

// Message from server BOT
socket.on("messageTo", (message, toUser) => {
  // console.log(`Socket IO Message to: ${toUser}`, message);
  message.username = "BOT";
  if (toUser == username)
    createMessage(message, null)
  // outputMessage(message, null);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Reply Message from server
socket.on("message", (message, replyTo) => {
  // console.log("Socket IO Message: ", message);

  if (blocked.indexOf(message.username) < 0) {
    createMessage(message, replyTo);
    // outputMessage(message, replyTo);
  } else {
    message.msgText = "BLOCKED";
    createMessage(message, replyTo);
    // outputMessage(message, replyTo);
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
    socket.emit("replyMessage", "REPLY: [" + replyTo + "] " + msg + "ßΓ" + nickname + "ßΓ" + team + "ßΓ" + xp, replyTo);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
}

var mustWait = false;

// Message submit
chatForm.addEventListener("submit", (e) => {

  if (mustWait == false) {
    console.log("submitted a message")
    mustWait = true;
    msgSubmit(e);
    var timer = document.getElementById("timer");
    timer.hidden = false;
    var clockIconBad = document.getElementById("clockIconBad");
    var clockIconGood = document.getElementById("clockIconGood");
    clockIconBad.hidden = false;
    clockIconGood.hidden = true;

    updateChatTimer(15);

    socket.emit("incrementScore", 1, team2addScoreTo, room)
  }

});

function updateChatTimer(time) {
  var clockIconBad = document.getElementById("clockIconBad");
  var clockIconGood = document.getElementById("clockIconGood");
  var timer = document.getElementById("timer");
  timer.innerText = time + "s";
  time--;
  if (time > 0) {
    // document.getElementById("msg").value = "";
    setTimeout(updateChatTimer, 1000, time);
  }
  else {
    clockIconBad.hidden = true;
    clockIconGood.hidden = false;
    mustWait = false;
    timer.hidden = true;
    timer.innerText = ""
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function createMessage(message, replyTo) {


  var msgBlockPrototype = document.getElementById("msgFormat");
  var msgBlock = msgBlockPrototype.cloneNode(true);
  msgBlock.id = message.username + "-" + message.time;
  msgBlock.hidden = false;

  let usernameTag = msgBlock.querySelector('#userTag');
  let userstats = msgBlock.querySelector('#userStats');
  let teamStat = msgBlock.querySelector('#teamStat');
  let xpStat = msgBlock.querySelector('#xpStat');

  //check for secret mode
  var uname //= document.createElement("strong");
  if (message.nckName == '')
    uname = message.username;
  else if (message.secretMode == 'on') {

    uname = message.nckName; // output nickname
    // } else {
    //   // output username and nickname
    //   uname = + message.username + " AKA " + message.nckName;
  }

  if (!(message.nckName) || message.username == "BOT") {
    let secretIcon = msgBlock.querySelector('#secretIcon');
    secretIcon.style.display = "none";
    console.log(message.username + "-" + message.nckName)
  }
  if (message.username == username) {
    usernameTag.style.color = "cyan"
  }


  if (message.username == "BOT") {
    uname = "CHATBOT";
    // let col = colors[(index + room.length) % colors.length];
    // msgBlock.style = `background: #9bacdf;`
  }

  if (replyTo != null) {
    let replyTag = msgBlock.querySelector('#replyTag');
    replyTag.innerText = replyTo;
    replyTag.hidden = false;
  }

  let messageText = msgBlock.querySelector('#msgText');
  messageText.innerText = message.msgText;

  let timeTag = msgBlock.querySelector('#timeTag');
  timeTag.innerText = message.time;


  usernameTag.innerText = uname;
  xpStat.innerText = "XP: " + message.xp;
  teamStat.innerText = "Team: " + message.team;

  if (message.xp != undefined) {
    usernameTag.addEventListener("mouseover", (e) => {
      userstats.hidden = false;
    })
  }

  usernameTag.addEventListener("mouseleave", () => {
    userstats.hidden = true;
  })

  teams.forEach((item, index) => {
    // if (message.team == team) {
    //   // let num = randomNumber(0, colors.length)
    //   // console.log(item, " len:", item.length)
    //   let col = colors[(colors.length - index + 1) % colors.length];
    //   msgBlock.style = `background: ${col};`
    // } else 
    if (message.team == item) {
      let col = colors[(index + room.length % 4 + 1) % colors.length];
      msgBlock.style = `background: ${col};`
    }
  })



  let likeBtn = msgBlock.querySelector('#likeBtn');
  let likeIcon = msgBlock.querySelector('#likeIcon');
  let numOfLikes = msgBlock.querySelector('#like');
  likeBtn.addEventListener("click", () => {
    if (username != message.username)
      if (likeIcon.style.color != "green") {
        likeIcon.style.color = "green";
        // message.xp += 2;
        // numOfLikes.innerText = parseInt(numOfLikes.innerText) + 1;
        console.log(`${username} liked ${message.username}'s comment`);
        socket.emit("chatVote", message.username, msgBlock.id, 'like');
      } else {
        likeIcon.style.color = "gray";
        // message.xp -= 2;
        // numOfLikes.innerText = parseInt(numOfLikes.innerText) - 1;
        console.log(`${username} unliked ${message.username}'s comment`);
        socket.emit("chatVote", message.username, msgBlock.id, 'unlike');
      }
    delay(250);
  })

  let hateBtn = msgBlock.querySelector('#hateBtn');
  let hateIcon = msgBlock.querySelector('#hateIcon');
  let numOfHates = msgBlock.querySelector('#hate');
  hateBtn.addEventListener("click", () => {
    if (username != message.username)
      if (hateIcon.style.color != "red") {
        hateIcon.style.color = "red";
        // message.xp -= 1;
        // numOfHates.innerText = parseInt(numOfHates.innerText) + 1;
        console.log(`${username} hated ${message.username}'s comment`);
        socket.emit("chatVote", message.username, msgBlock.id, 'hate');
      } else {
        hateIcon.style.color = "gray";
        // message.xp += 1;
        // numOfHates.innerText = parseInt(numOfHates.innerText) - 1;
        console.log(`${username} unhated ${message.username}'s comment`);
        socket.emit("chatVote", message.username, msgBlock.id, 'unhate');
      }
    delay(250);
  })

  let hideBtn = msgBlock.querySelector('#hideBtn');
  let extraBtns = msgBlock.querySelector('#extraBtns');
  let hideIcon = msgBlock.querySelector('#hideIcon');
  hideBtn.addEventListener("click", () => {
    if (extraBtns.hidden == false) {
      extraBtns.hidden = true;
    } else {
      extraBtns.hidden = false;
    }
  })
  hideBtn.addEventListener("mouseleave", (event) => {
    hideIcon.style = "font-size:16px; color:black;"
  });
  hideBtn.addEventListener("mouseover", function () {
    hideIcon.style = "font-size:16px; color:rgb(120, 60, 143);"
  });

  let videoBtn = msgBlock.querySelector('#videoBtn');
  let videoIcon = msgBlock.querySelector('#videoIcon');
  //add the video chat button
  if ((username != message.username & message.username != "BOT")) {

    videoIcon.addEventListener("mouseover", () => {
      videoIcon.style.color = "blue";
    })
    videoIcon.addEventListener("mouseleave", () => {
      videoIcon.style.color = "black";
    })
    videoBtn.addEventListener("click", () => {
      if (username != message.username & message.username != "BOT") {
        videoCallUser(message.username);
        console.log("joining user live");
      }
    })
  } else { videoBtn.hidden = true; }

  let coinBtn = msgBlock.querySelector('#coinBtn');
  //Tip in chat Button
  if (username != message.username) {
    let coin = msgBlock.querySelector('#coinIcon');

    coinBtn.addEventListener("mouseleave", (event) => {
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
        setTimeout(() => {
          coin.style = "font-size:16px; color:gold;";
        }, 1000)
      }
    });
  }

  let friendBtn = msgBlock.querySelector('#addFriendBtn');
  let friendIcon = msgBlock.querySelector('#addFriendIcon');
  //Follow in chat Button
  if (username != message.username & message.username != "BOT") {
    //add friend
    if (friendsList.length > 0) {
      for (const [index, val] of friendsList.entries()) {
        // friendsList.forEach((item, indx) => {
        if (message.username == val) {
          friendIcon.className = "fas fa-check";
          usernameTag.style.color = yellowgreen;
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

    // friendIcon.style = "font-size:16px;color:green;padding-right: 5px;";
    // friendIcon.name = "friend";
    // friendBtn.appendChild(friendIcon);
    // commentTbl.appendChild(friendBtn);

    friendBtn.addEventListener("click", function () {
      if (username != message.username & friendIcon.className == "fas fa-plus-square") {
        addFriend(username, message.username, "add");
        console.log(`${username} followed ${message.username}`);
        socket.emit("chatMessageTo", `${username} started following ${message.username}`, message.username);
      }
    });

  }


  let blockBtn = msgBlock.querySelector('#blockBtn');
  let blockIcon = msgBlock.querySelector('#blockIcon');
  //Block in chat Button
  if (username != message.username & message.username != "BOT") {
    //block
    blockedList.forEach((item, index) => {
      if (message.username == item) {
        blockIcon.style = "font-size:16px; color:grey;";
      }
    })
    // block button event listener
    blockBtn.addEventListener("click", function () {
      if (username != message.username) {
        addFriend(username, message.username, "remove");
        console.log(`${username} blocked ${message.username}`);
        socket.emit("chatMessageTo", `${username} has blocked you, try to be less annoying.`, message.username);
      }
    });
  }


  let trashBtn = msgBlock.querySelector('#trashBtn');
  let trashIcon = msgBlock.querySelector('#trashIcon');
  //deleteIcon chatbox Button
  if (1) {
    //deleteIcon
    trashBtn.addEventListener("click", function () {
      msgBlock.remove();
    });
    trashBtn.addEventListener("mouseleave", function () {
      trashIcon.style = "font-size:16px;color:blue;";
    });
    trashBtn.addEventListener("mouseover", function () {
      trashIcon.style = "font-size:16px;color:red;";
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
      e.preventDefault();
      if (mustWait == false) {
        inputMsg.placeholder = "Enter Message...";
        if (reply.action == true)
          replySubmit(e, reply.target);
        else
          msgSubmit(e, null);
        reply.action = false;
      }

    });

    var cancelBtn = document.getElementById("cancelBtn");

    msgBlock.addEventListener('click', function (evt) {
      // var o = this,
      // ot = this.textContent;
      if (!throttle && evt.detail === 3) {
        // this.textContent = 'Triple-clicked!';

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

  var chatbox = document.getElementById("chatBox")
  chatbox.append(msgBlock);

}

















// Output message to chatbox
function outputMessage(message, replyTo) {
  const div = document.createElement("div");
  div.id = message.username + "-" + message.time;
  div.classList.add("message");
  var topDiv = document.createElement("div"); //topDiv.classList.add("meta");
  // topDiv.style = "display: flex; align-items: flex-start;";
  div.appendChild(topDiv);
  const header = document.createElement("div"); topDiv.appendChild(header);
  header.classList.add("meta"); header.style += "margin-top: 10px; padding: 3px;";

  //check for secret mode
  var uname;
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
  }

  const commentTbl = document.createElement("div");
  commentTbl.className = "chat-commentTbl";
  commentTbl.show = false;

  //HANDLE Show Buttons
  var showBtnIcon = document.createElement("i");
  showBtnIcon.className = "fas fa-sliders";
  showBtnIcon.addEventListener("click", () => {
    var cancelBtn = document.getElementById("cancelBtn");
    cancelBtn.style = "display: block";
    inputMsg.placeholder = "Replying to " + message.username + " AKA " + message.nickname;
    reply.action = true;
    reply.target = message.username;
    throttle = true;
  })


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


  //add the video chat button
  if ((username != message.username & message.username != "BOT")) {
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
    const coin = document.createElement("i");
    coin.className = "fas fa-coins";
    coin.style = "font-size:16px; color:silver;";
    coinBtn.appendChild(coin);
    commentTbl.appendChild(coinBtn);

    coinBtn.addEventListener("mouseleave", (event) => {
      coin.style = "font-size:16px; color:silver;"
    });
    coinBtn.addEventListener("mouseover", function () {
      coin.style = "font-size:16px; color:gold;"
    });
    coinBtn.addEventListener("click", function () {
      if (username != message.username) {
        tipUsers(username, message.username, 1);
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
      for (const [index, val] of friendsList.entries()) {
        if (message.username == val) {
          friendIcon.className = "fas fa-check";
          break;
        } else {
          friendIcon.className = "fas fa-plus-square";
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
      e.preventDefault();
      if (!mustWait) {
        inputMsg.placeholder = "Enter Message...";
        if (reply.action == true)
          replySubmit(e, reply.target);
        else
          msgSubmit(e, null);
        reply.action = false;
      }
    });


    // div.parentElement.style = "background: auga;";

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
  var teams;
  try {
    var teams = JSON.parse(teamBox.innerText);
  } catch (error) {
    var teams = teamBox.innerText.split(",");
  }
  teamBox.innerText = '';
  var tbl = document.createElement("table");
  var thead = document.createElement("thead");
  var tbody = document.createElement("tbody");
  let th1 = document.createElement("th");
  let th2 = document.createElement("th");
  // let th3 = document.createElement("th");
  th1.innerHTML = `<strong>TeamName</strong>`;
  th2.innerHTML = `<strong>Score</strong>`;
  // th3.innerHTML = `<strong>+</strong>`;
  thead.appendChild(th1);
  thead.appendChild(th2);
  // thead.appendChild(th3);
  tbl.appendChild(thead)



  teams.forEach((item, index) => {
    //console.log(`teams Obj: ${index}. ${item}`);
    // let score = Math.ceil(Math.random() * 1000);
    // scores[item] = 0;
    let tr = document.createElement("tr");
    let tdName = document.createElement("td");
    let tdScore = document.createElement("td");

    let tdBtn = document.createElement("td");

    // var btn = document.createElement("button");
    // btn.id = "join" + item + "Team";
    // btn.innerText = "Join";
    // btn.style = "padding: 0px 5px; color: black;";
    // btn.addEventListener("click", () => {
    //   team = item;
    //   tipUsers(username, "BOT", roomJSON[0]["joinCost"]);
    //   // socket.emit("user joined room", room, username, item, 30, room, "FFF", teams); //item = team
    //   // socket.emit("setStreamJoinConfig", username, item, 30, room, "FFF", teams); //item = team
    // })

    // let col = colors[(index + room.length) % colors.length];
    let col = colors[(index + room.length % 4 + 1) % colors.length];
    tdName.style = `background: ${col};`

    tdName.innerText = item;
    tdScore.id = "tdScore#" + item;
    tdScore.innerHTML = `<strong>${scores[index]}</strong>`;
    // tdScore.id = item + "Score";  
    tdScore.id = item + "#Score";
    // tdBtn.append(btn);
    tr.appendChild(tdName);
    tr.appendChild(tdScore);
    // tr.appendChild(tdBtn);
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
  console.log("Output Users: ", users);
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

// //Prompt the user before leave chat room
// document.getElementById("leave-btn").addEventListener("click", () => {
//   const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
//   if (leaveRoom) {
//     window.location = "../home";
//   } else {
//   }
// });

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