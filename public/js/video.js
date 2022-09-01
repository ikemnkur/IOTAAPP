const videoSocket = io('/');
// const videoSocket = io({
//   transports: ["websocket"], pingInterval: 1000 * 60 * 5,
//   pingTimeout: 1000 * 60 * 3
// });
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
var userData = {
  "name": userID,
  "userTeam": team, // gets this from the modal.html 
  "points": 50,
};

activeUsersVideo = {};

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function test() {
  console.log('start timer');
  await delay(1000);
  console.log('after 1 second');
}

async function fetchUsers() {
  videoSocket.emit('fetchActiveUsers', ROOM_ID, userData);
  await delay(250);
}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream, userID, myCanvas)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    console.log('Peer call.answer()');
    call.on('stream', userVideoStream => {
      console.log('Peer call.on()');
      addVideoStream(video, userVideoStream, activeUsersVideo[activeUsersVideo.length - 1], canvas) // video stream of the self
    });
  })

  videoSocket.on('user-connected', (userId, userData) => {
    console.log("Connect Event (userId): ", userId);
    fetchUsers();// Set and fetch the active user list
    connectToNewUser(userId, stream, userData); 
  })
})

videoSocket.on('user-disconnected', userId => {
  console.log("Disconnect Event (userId): ", userId);
  if (peers[userId]) peers[userId].close();
});

videoSocket.on('returnActiveUsers', data => { // get the active user in the current room
  activeUsersVideo = data;
  console.log("live users: ", activeUsersVideo);
});

myPeer.on('open', id => {
  // videoSocket.emit('join-room', ROOM_ID, id)
  console.log('Peer Open Id: ', id);
  videoSocket.emit('connectNewStream', ROOM_ID, id, userData); //Set up socket.io

})

function connectToNewUser(userId, stream, userData) { //setup connection stream to new user
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video');
  var canvas = document.createElement("canvas");
  // console.log('call Obj: ', call):
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, userData, canvas)
  })
  call.on('close', () => {
    video.remove()
    canvas.remove();
  })
  // activeUsersVideo.push(userData);
  peers[userId] = call
};

function addVideoStream(video, stream, userData, canvas) { //Draw video to canvas element then append that to the DOM
  var uname, userTeam;

  var len = activeUsersVideo.length;
  var data = activeUsersVideo[len - 1];

  console.log("Active Users Video: ", activeUsersVideo);

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
  video.srcObject = stream

  video.addEventListener('loadedmetadata', () => {
    video.play()
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

  // var trv = document.createElement("td"); trv.className = "tbl";
  // var tdv = document.createElement("td"); tdv.className = "tbl";
  // var trc = document.createElement("tr"); trc.className = "tbl";
  var tdc = document.createElement("td"); //tdv.className = "tbl";

  var tbl = document.getElementById("videoTable");

  // append video element
  // tbody.appendChild(trv);  
  // tbl.appendChild(trv);
  // trv.appendChild(tdv);
  // tdv.appendChild(video);
  // append canvas element
  // tbl.appendChild(trv);
  // trv.appendChild(tdc);
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
