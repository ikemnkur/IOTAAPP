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
myVideo.muted = true
var action = "change";
const peers = {}
var mode = 0, posX = 0;
var ROOM_ID = roomJSON[0]["roomID"];
var userID = username;
var uname, userTeam;

userGraphics = []

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream, userID)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream, userID) // video stream of the self
    })
  })

  videoSocket.on('user-connected', (userId, userData) => {
    console.log("Connect Event (userId): ", userId);
    connectToNewUser(userId, stream, userData);
  })
})

videoSocket.on('user-disconnected', userId => {
  console.log("Disconnect Event (userId): ", userId);
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  // videoSocket.emit('join-room', ROOM_ID, id)
  console.log('Peer Open Id: ', id);
  var userData = {
    "name": userID,
    "userTeam": team.innerText.innerText, // gets this from the modal.html 
    "points": 50,
    "peerjsID": id
  }
  videoSocket.emit('connectNewStream', ROOM_ID, id, userData);
})

function connectToNewUser(userId, stream, userData) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  // console.log('call Obj: ', call):
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, userData)
  })
  call.on('close', () => {
    video.remove()
  })
  //userGraphics.push(userData);
  peers[userId] = call
}


// function AVS(video, userVideoStream, userData) {
//   if (document.getElementById('id01').style.display != 'none') {
//     clearTimeout(myTimeout);
//     addVideoStream(video, userVideoStream, userData);
//   }
// }


function addVideoStream(video, stream, userData) {

  console.log("USERDATA: ", userData);
  
  if (userData.name != undefined) {
    uname = userData.name;
    userTeam = userData.userTeam;
  } else {
    userTeam = team.innerText; console.log("this user's team.innerText: ", team.innerText);
    uname = userData;
  }

  var canvas = document.createElement("canvas");
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
  otherUserTeam.id = "userTeamlabel";
  otherUserTeam.innerText = userTeam;
  var otherUsername = document.createElement("h3");
  otherUsername.innerText = uname;
  var d = document.createElement("div");
  d.appendChild(otherUserTeam);
  d.appendChild(otherUsername);

  var trv = document.createElement("td"); trv.className = "tbl";
  var tdv = document.createElement("td"); tdv.className = "tbl";
  var trc = document.createElement("tr"); trc.className = "tbl";
  var tdc = document.createElement("td"); tdv.className = "tbl";

  var tbl = document.getElementById("videoTable");

  // append video element
  // tbody.appendChild(trv);  
  // tbl.appendChild(trv);
  // trv.appendChild(tdv);
  // tdv.appendChild(video);
  // append canvas element
  tbl.appendChild(trv);
  trv.appendChild(tdc);
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
