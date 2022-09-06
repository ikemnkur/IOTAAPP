const videoSocket = io('/');
// const videoSocket = io({
//   transports: ["websocket"], pingInterval: 1000 * 60 * 5,
//   pingTimeout: 1000 * 60 * 3
// });

// import {io} from "socket.io-client"

// const videoSocket = io("http//localhost:3000")

videoSocket.on("connect",() => {
    console.log(`you connected with socket.id ${videoSocket.id}`)
    videoSocket.emit("custom-event", 10, "hello", {val: "object 1"})
})

const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  // get the peerjs server info
  host: '/', //localhost:3001
  port: '3001'
})
const myVideo = document.createElement('video')
const myCanvas = document.createElement('canvas')
myVideo.muted = true
var action = "change";
const peers = {}
var mode = 0, posX = 0;
var ROOM_ID = roomJSON[0]["roomID"];
var userID = username;
const myUserData = {
  "name": userID,
  "userTeam": team, // gets this from the modal.html 
  "points": 50,
  "peerId": null,
};
var OUD = {};

activeUsersVideo = {};

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// async function test() {
//   console.log('start timer');
//   await delay(1000);
//   console.log('after 1 second');
// }

// async function fetchUsers(peerId, otherUserData) {
//   videoSocket.emit('fetchActiveUsers', ROOM_ID, otherUserData);
//   await delay(250);
// }

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  // videoSocket.emit('fetchActiveUsers', ROOM_ID, myUserData);
  addVideoStream(myVideo, stream, userID, myCanvas)
  // videoSocket.emit('stupid', ROOM_ID)

  myPeer.on('call', call => {
    // videoSocket.emit('fetchActiveUsers', ROOM_ID, myUserData);
    call.answer(stream)
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    console.log('Peer call.answer()');
    call.on('stream', userVideoStream => {
      console.log('Peer call.on()');
      var len = activeUsersVideo.length - 1;
      if (len == -1) len = 0; var dname = activeUsersVideo[len].name;
      addVideoStream(video, userVideoStream, "OUD", canvas) // video stream of the self
    });
  })

  videoSocket.on('user-connected', (otherUserData) => {
    console.log("Connect Event (peerId): ", otherUserData.peerId);
    // Set and fetch the active user list
    OUD = otherUserData; console.log("other user data: ", OUD);
    connectToNewUser(otherUserData.peerId, stream, otherUserData);
  })

})

videoSocket.on('dummy', (text) => {
  console.log("test event: ", text);
})

videoSocket.on('user-disconnected', ({peerId, data}) => {
  console.log("Disconnect Event (peerId): ", peerId);
  activeUsersVideo = data;
  console.log("live users: ", activeUsersVideo);
  if (peers[peerId]) peers[peerId].close();
});

videoSocket.on('returnActiveUsers', (data) => { // get the active user in the current room
  activeUsersVideo = data;
  console.log("live users returned: ", activeUsersVideo);
});

myPeer.on('open', id => {
  // videoSocket.emit('join-room', ROOM_ID, id)
  console.log('Peer Open Id: ', id);
  myUserData.peerId = id;
  // delay(500);
  // setTimeout(videoSocket.emit('stupid', ROOM_ID), 4000);
  // videoSocket.emit('stupid', ROOM_ID)
  // setTimeout(videoSocket.emit('connectNewStream', ROOM_ID, id, myUserData), 5000);
  videoSocket.emit('connectNewStream', ROOM_ID, id, myUserData); //Set up socket.io

  // videoSocket.emit('fetchActiveUsers', ROOM_ID, myUserData);
})

function connectToNewUser(peerId, stream, userData) { //setup connection stream to new user
  videoSocket.emit('fetchActiveUsers', ROOM_ID, OUD);
  const call = myPeer.call(peerId, stream)
  const video = document.createElement('video');
  const canvas = document.createElement("canvas");
  console.log('call Obj: ', call);
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, OUD, canvas)
  })
  call.on('close', () => {
    video.remove()
    // canvas.remove();
  })
  // activeUsersVideo.push(userData);
  peers[peerId] = call
};

function addVideoStream(video, stream, userData, canvas) { //Draw video to canvas element then append that to the DOM
  var uname, userTeam;
  video.srcObject = stream
  var idx = activeUsersVideo.length - 1; if (idx == -1) idx = 0;
  var data = activeUsersVideo[idx];

  console.log("User Data Json: ", userData);

  if (userData.name != undefined) {
    uname = data.name;
    userTeam = data.userTeam;
  } else {
    userTeam = team;
    uname = userData;
  }

  console.log("User ", uname, " has joined team: ", userTeam);

  canvas.id = 'canvas#' + uname;
  let w = 300, h = 220;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w;
  canvas.style.height = h;
  var context = canvas.getContext('2d');

  video.id = "video#" + uname;
  // video.srcObject = stream

  video.addEventListener('loadedmetadata', () => {
    video.play();
    console.log("User " + uname + "'s Video play event. ");
  })

  // changed
  video.addEventListener('play', function () {
    draw(this, context, 300, 230, canvas.id);
  }, false);

  var otherUserTeam = document.createElement("h2");
  otherUserTeam.id = uname + "#Teamlabel";
  otherUserTeam.innerText = userTeam;
  var otherUsername = document.createElement("h3");
  otherUsername.innerText = uname;
  var d = document.createElement("div");
  d.appendChild(otherUserTeam);
  d.appendChild(otherUsername);

  var tbl = document.getElementById("videoTable");
  var tdc = document.createElement("td");
  tbl.appendChild(tdc);
  tdc.appendChild(d);
  tdc.appendChild(video);
  tdc.appendChild(canvas);

  // videoGrid.append(video)
  // videoGrid.append(canvas)
}

//added these functions below
function draw(video, context, width, height, id) {
  // if (video.id == "remote-video") {
  var canvas = document.getElementById(id);
  var ctxt = canvas.getContext('2d');
  ctxt.drawImage(video, 0, 0, width, height);
  if (action == "change") {
    redShape(canvas);
  } else {
    Circle(canvas);
  }
  var myGamePiece = new component(30, 30, "../images/smiley.gif", 10, 120, "image", canvas);
  myGamePiece.update();
  setTimeout(draw, 10, video, context, width, height, id);

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

var search = document.getElementById("imgSearch");
var searchBtn = document.getElementById("searchBtn");
const fullImgList = {}; // list of imgs

// searchBtn.addEventListener("click", previewImg(search.value));

searchBtn.addEventListener("click", () => {
  console.log("searching....");
  videoSocket.emit("fetchImages", (ROOM_ID, username));
});

videoSocket.on("fetchImgList", (data) => {
    console.log("done searching....");
    fullImgList = data;
    if (search.value.length > 3) {
      let match = searchImages(image);
      if (match != null) {
        var canvas = document.getElementById("imgSearchDisplay");
        var preview = new component(30, 30, `../images/${match}`, 10, 120, "image", canvas);
        preview.update();
      }
    }
})


function previewImg(image) {
  console.log("searching....")
  videoSocket.emit("fetchImages", (ROOM_ID, username));
  videoSocket.on("fetchImgList", (data) => { fullImgList = data; })
  if (search.value.length > 3) {
    let match = searchImages(image);
    if (match != null) {
      var canvas = document.getElementById("imgSearchDisplay");
      var preview = new component(30, 30, `../images/${match}`, 10, 120, "image", canvas);
      preview.update();
    }
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
  console.log("searching for: ", search, " in ", fullImgList);
  for (i = 0; i < x.length; i++) {
    if (x[i].toLowerCase().includes(search)) {
      // x[i].style.display = "none";
      matches.push(x[i]);
      // x[i].style.display = "";
    }
  }
  console.log("Matching Search Results: ", matches)
  if (matches != null) {
    return matches[0];
  } else {
    return null;
  }
}
