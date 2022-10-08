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
var canJoin, timer;

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

    // navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true
    // }).then(myStream => {

    //   myUserData.streamObj = myStream.toString();
    //   console.log("Outgoing Stream", myUserData.streamObj);
    //   addSelfVideoStream(myVideo, myStream, myUserData, myCanvas)

    //   peer.on('call', call => {
    //     call.answer(myStream);
    //     var video = document.createElement('video')
    //     var canvas = document.createElement('canvas')
    //     console.log('Peer.on("call"):', call.metadata);

    //     call.on('stream', userVideoStream => {
    //       addOtherVideoStream(video, userVideoStream, myUserData, canvas)
    //     });
    //   })

    videoSocket.emit('connectNewStream', ROOM_ID, id, myUserData); //Set up socket.io
    //   console.log("Outgoing Stream", myStream);
    //   // //emitting from app.js when 
    //   videoSocket.on('userConnected', (activeUserz, roomID, otherUserData) => {
    //     if (roomID == ROOM_ID & otherUserData.name != userID) {
    //       console.log(`Connect Event RM: ${roomID} (peerId): `, otherUserData.peerId);
    //       // Set and fetch the active user list
    //       OUD = otherUserData; // console.log("other user data: ", OUD);
    //       // console.log("Incoming Stream", stream);
    //       Room = activeUserz; // console.log("AUV: ", Room);
    //       connectToNewUser(otherUserData.peerId, otherUserData.streamObj, OUD);
    //     }
    //   })
    // })

    // videoSocket.emit('setActiveUsers', ROOM_ID, myUserData);
    // setTimeout(videoSocket.emit('connectNewStream', ROOM_ID, id, myUserData), 5000);



    // Answering A Call
    // When a call is made to our UUID, we receive a call event on our peer object, we can then ask the user if they want to accept the call or not. If they accept the call, we need to grab the user’s video and audio inputs, and send those to the caller. If the call is rejected, we can close the connection.

    peer.on("call", (call) => {
      // if (confirm(`Accept call from ${call.peer}?`)) {
      if (canJoin){
        // grab the camera and mic
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((GUMstream) => {
            const stream = document.getElementById("video").srcObject;
            // switch to the video call and play the camera preview
            // document.getElementById("local-video").srcObject = stream;
            // document.getElementById("local-video").play();
            // play the local preview
            // document.querySelector("#local-video").srcObject = stream;
            // document.querySelector("#local-video").play();
            // answer the call
            call.answer(stream);
            //remove the preview stream
            document.getElementById('video').style.display = "none";
            // save the close function
            currentCall[call.peer] = call;
            // change to the video view
            // document.querySelector("#menu").style.display = "none";
            // document.querySelector("#live").style.display = "block";
            call.on("stream", (remoteStream) => {
              let title = "video#" + call.peer;
              if (document.getElementById(title) == null) {
                // when we receive the remote stream, play it
                let div = document.createElement("div");
                div.className = "videoDiv";
                let video = document.createElement("video");
                let header = document.createElement("header");
                header.innerText = title;
                video.id = title;
                video.srcObject = remoteStream;
                video.play();
                let livefeedDiv = document.getElementById("videoTable");
                div.appendChild(header);
                div.appendChild(video);
                livefeedDiv.appendChild(div);
              }
              //   document.getElementById("remote-video").srcObject = remoteStream;
              //   document.getElementById("remote-video").play();
            });
          })
          .catch((err) => {
            console.log("Failed to get local stream:", err);
          });
      } else {
        // user rejected the call, close it
        call.close();
      }
    });
  })
})

// //emitting from app.js when 
videoSocket.on('userConnected', (activeUserz, roomID, otherUserData) => {
  if (roomID == ROOM_ID) { //& otherUserData.name != userID) {
    console.log(`Connect Event RM: ${roomID} (peerId): `, otherUserData.peerId);
    // Set and fetch the active user list
    OUD = otherUserData; // console.log("other user data: ", OUD);
    // console.log("Incoming Stream", stream);
    Room = activeUserz; // console.log("AUV: ", Room);
    // connectToNewUser(otherUserData.peerId, otherUserData.streamObj, OUD);
    Room.forEach((item, index) => {
      if (document.getElementById("video#" + item.userId) == null)
        callUser(item);
    })
    // callUser(otherUserData);
  }
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
  // switch to the video call and play the camera preview
  //   document.getElementById("menu").style.display = "none";
  // document.getElementById("live").style.display = "block";
  // document.getElementById("local-video").srcObject = stream;
  // document.getElementById("local-video").play();
  // make the call
  const call = peer.call(peerID, stream);
  if (call != undefined) {
    call.on("stream", (stream) => {
      let title = "video#" + call.peer;
      if (document.getElementById(title) == null) { //check for duplicates
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
      // document.getElementById("remote-video").srcObject = stream;
      // document.getElementById("remote-video").play();
    });
  } else {
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
  call.on("data", (stream) => {
    let title = "video#" + call.peer;
    if (document.getElementById(title) == null) { //check for duplicates
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
  });
  call.on('close', () => {
    endCall(call.peer)
  })
  // save the close function
  currentCall[call.peer] = call;
}


// Ending The Call
// When the call is over the user can click the `End call` button to terminate the connection. Then, we can show the menu once again.

function endCall(peerid) {
  // Go back to the menu
  // document.querySelector("#menu").style.display = "block";
  // document.querySelector("#live").style.display = "none";
  // // If there is no current call, return
  if (!currentCall[peerid]) return;
  // Close the call, and reset the function
  try {
    currentCall[peerid].close();
  } catch { }
  currentCall[peerid] = undefined;
}

async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// peer.connect(userID, {metadata: {myUserData}});

var OUD = {};
var Room = {};

videoSocket.on('user-disconnected', ({ peerId, data }) => {
  console.log("Disconnect Event (peerId): ", peerId);
  Room = data;

  if (peers[peerId]) {
    peers[peerId].close();
    console.log("User disconnected, live users: ", Room);
  }
});

videoSocket.on('getActiveUsers', (roomID, data) => { // get the active user in the current room
  if (roomID == ROOM_ID) {
    Room = data;
    console.log("live users recieved: ", Room);
  }
});

// var peerConnect = peer.connect('dest-peer-id');

// peer.on('connection', function (peerConnectObj) {

// });

// peerConnect.on('open', function () {
//   // Receive messages
//   conn.on('data', function (data) {
//     console.log('Received', data);
//   });

//   // Send messages
//   conn.send('Hello!');
// });

// peer.on('connection', function(dataConnection) { 
//   console.log("Peer Connection Event", dataConnection.metadata)
//   dataConnection.on("data", (data) => {
//     console.log("Received data", data);
//   });
//   var metaData = dataConnection.metadata;
//   // connectToNewUser(otherUserData.peerId, stream, OUD);
// });

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

function connectToNewUser(peerId, stream, otherUserData) { //setup connection stream to new user
  // videoSocket.emit('fetchActiveUsers', ROOM_ID, OUD);
  // if (streams[otherUserData.name] == null) {
  //   streams[otherUserData.name] = [];
  // }
  // add stream to streams array
  // streams[otherUserData.name].push({ stream, otherUserData });

  console.log('connectToNewUser Obj: ', peerId);
  var call = peer.call(peerId, stream, { metadata: { otherUserData } })
  var video = document.createElement('video');
  var canvas = document.createElement("canvas");
  // console.log('call Obj: ', call);
  call.on('stream', userVideoStream => {
    addOtherVideoStream(video, userVideoStream, otherUserData, canvas)
  })
  call.on('close', () => {
    video.remove()
    canvas.remove();
  })
  peers[peerId] = call
};


function addSelfVideoStream(video, stream, userData, canvas) { //Draw video to canvas element then append that to the DOM
  var uname = userData.name, userTeam = userData.userTeam;

  video.srcObject = stream

  // console.log("User Data Json: ", userData);

  // console.log("User ", uname, " has joined team: ", userTeam);

  canvas.addEventListener("click", () => {
    focusedCanvas = canvas.id;
  });

  let joiningUser = activeUsers[activeUsers.length - 1]

  canvas.id = 'canvas#' + joiningUser.username;
  let w = 300, h = 220;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w;
  canvas.style.height = h;
  var context = canvas.getContext('2d');

  video.id = "video#" + uname;
  // video.srcObject = stream

  video.addEventListener('loadedmetadata', () => {
    console.log("User " + uname + "'s Video play event. ");
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

  canvas.addEventListener("click", () => {
    focusedCanvas = canvas.id;
  });

  let joiningUser = activeUsers[activeUsers.length - 1]

  canvas.id = 'canvas#' + joiningUser.username;
  let w = 300, h = 220;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w;
  canvas.style.height = h;
  var context = canvas.getContext('2d');

  video.id = "video#" + uname;
  // video.srcObject = stream

  video.addEventListener('loadedmetadata', () => {
    console.log("User " + uname + "'s Video play event. ");
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
  canvas.addEventListener("click", () => {
    focusedCanvas = canvas.id;
    console.log("focusedCanvas = ", canvas.id)
    // removeEventListener("click", () => { });
    removeEventListener("click");
  })
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

  context.font = '24px Arial';
  context.fillText(userData.userTeam, 10, 24);

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
    if (searchTerm.length >= 3) {
      let matches = searchImages(searchTerm);
      var imagePrevDiv = document.getElementById("imgPrevDiv");
      if (focusedCanvas == null)
        focusedCanvas = myCanvas.id;
      var targetCanvas = document.getElementById(focusedCanvas);
      removeAllChildNodes(imagePrevDiv);
      matches.forEach(match => {
        if (match != null) {
          // var imageP = document.getElementById("previewImg").src =`../images/${match}` ;
          var image = document.createElement("img");
          image.src = `../images/${match}`;
          image.height = 64;
          image.width = 64;
          imagePrevDiv.appendChild(image);
          image.style = "padding: 2px"

          cntrCvnX = targetCanvas.width / 2 - 32;
          cntrCvnY = targetCanvas.height / 2 - 32;
          image.addEventListener("click", () => {
            console.log("adding image to target canvas: ", targetCanvas);
            imgSentToCanvas = new component(64, 64, `${image.src}`, cntrCvnX, cntrCvnY, "image", targetCanvas);
            imgSentToCanvas.update();
          })
        }
      });
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

}