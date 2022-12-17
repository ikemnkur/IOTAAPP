const videoSocket = io('/');

const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')
const myCanvas = document.createElement('canvas')
myVideo.muted = true
var action = "change";
var peers = {};
var streams = {};
var socketid = "";
var mode = 0, posX = 0;
var ROOM_ID = roomJSON[0]["roomID"];
var userID = username;
var focusedCanvas, imgSentToCanvas;
var currentCall = {};
var myUserData;
var peer;
const teamsArray = teams//JSON.parse(document.getElementById("teamnames").innerText);
var canJoin = false, timer = 60; // for the temporary stream join
var OUD = {};
var Room = {};
var streamers = {};

videoSocket.on("connect", () => {
  console.log(`you connected with socket.id ${videoSocket.id}`);
  socketid = videoSocket.id;

  myUserData = {
    "id": socketid,
    "name": userID,
    "userTeam": team, // gets this from the modal.html 
    "XP": userJSON[0]["xp"],
    "peerId": userID,
    "HP": 100,
    "streaming": false,
    "score": 0,
    "coins": userJSON[0]["coins"],
  };

  // peer = new Peer(userID, {
  //   // get the peerjs server info
  //   host: '/', //localhost:3001
  //   port: '3001',
  // });
  videoSocket.emit('connectNewStream', ROOM_ID, userID, myUserData); //Set up socket.io
  // peer.on('open', (id) => {

  //   console.log('Peer Open Id: ', id);
  //   myUserData.id = socketid;
  //   myUserData.peerId = id;

  //   // videoSocket.emit('connectNewStream', ROOM_ID, id, myUserData); //Set up socket.io

  //   // Answering A Call
  //   // When a call is made to our UUID, we receive a call event on our peer object, we can then ask the user if they want to accept the call or not. If they accept the call, we need to grab the user’s video and audio inputs, and send those to the caller. If the call is rejected, we can close the connection.

  // })
})
peer = new Peer(userID, {
  // get the peerjs server info
  host: '/', //localhost:3001
  port: '3001',
});

peer.on("call", (call) => {
  console.log(" Accept call from peer: ", call.peer)
  var user //= getUserDatabyUserId(call.peer)
  // if 
  // (confirm(`Accept call from ${call.peer}?`)) //{
  // delay(500);


  Room.forEach((item, index) => {
    if (item.streaming == true) {
      if (item.name != call.peer) {
        user = item;

      }

    }
    console.log("Check User: ", "#", index, item.streaming)
  })
  
  // if (user.streaming) {
  if (1) {
    console.log("Streaming User: ", user)
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
  if (Room.length > 0) {
    if (Room[0].peerId == userID) {
      videoSocket.emit("askForRoomUpdate", ROOM_ID);
    }
  } else {
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

function createTeamVideoStreams(stream, userData) {


  teamsArray.forEach((index, item) => {
    var video = document.createElement('video');
    var canvas = document.createElement("canvas");
    video.srcObject = stream;
    canvas.clicked = false;

    canvas.addEventListener("click", () => {
      focusedCanvas = canvas.id;
      canvas.clicked = !canvas.clicked;
      let sty = "border-left: 5px solid #E3555E; padding: 5px; background-color: #d1f7fa; color: #434343;"
      if (canvas.clicked)
        canvas.style = sty;
      else
        canvas.style = "";
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

    var tbl = document.getElementById("videoTable");
    var tdc = document.createElement("td");
    tbl.appendChild(tdc);
    tdc.appendChild(video);
    tdc.appendChild(canvas);

  })

}

function addSelfVideoStream(stream, userData) { //Draw video to canvas element then append that to the DOM
  // var uname = userData.name; 
  // var userTeam = userData.userTeam;

  if (document.getElementById("canvas#" + userData.name) != null)
    return 0;
  var video = document.createElement('video');
  var canvas = document.createElement("canvas");

  video.srcObject = stream


  // console.log("User Data Json: ", userData);

  // console.log("User ", uname, " has joined team: ", userTeam);
  canvas.clicked = false;

  canvas.addEventListener("click", () => {
    focusedCanvas = canvas.id;
    canvas.clicked = !canvas.clicked;
    let sty = "border-left: 5px solid #E3555E; padding: 5px; background-color: #d1f7fa; color: #434343;"
    if (canvas.clicked)
      canvas.style = sty;
    else
      canvas.style = "";
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
              targetCanvas = document.getElementById(focusedCanvas);
              console.log("adding image to target canvas: ", document.getElementById(focusedCanvas));
              imgSentToCanvas = new component(64, 64, `${image.src}`, cntrCvnX, cntrCvnY, "image", targetCanvas);
              imgSentToCanvas.update();
            })
            image.addEventListener("click", () => {
              // console.log("adding image to library: ", image);
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