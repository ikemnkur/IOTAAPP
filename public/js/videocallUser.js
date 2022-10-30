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
var sentImages = [];

var user_Peers = {};
const peerObj = new Peer(userID);

const teampeer = {};

// const chatContainer = document.getElementById('videoTable');
// const remoteVideoContainer = document.getElementById('videoTable');
// // const chatContainer = document.getElementById('left');
// // const remoteVideoContainer = document.getElementById('right');

// // const toggleButton = document.getElementById('toggle-cam');
// // const ROOM_ID = window.location.pathname.split('/')[2];

// // let rmJSONtxt = document.getElementById("rmJSON");
// // let rmJSON = JSON.parse(rmJSONtxt.innerText);

// // let ROOM_ID = rmJSON[0]["roomID"];

// const createUserVideo = document.createElement("video");
// createUserVideo.id = 'user-video';
// const userTD = document.createElement("td");
// userTD.appendChild(createUserVideo);
// chatContainer.appendChild(userTD);
// const userVideo = document.getElementById('user-video');
// let userStream;
// let isAdmin = false;
// // const socket = io('/');

// function callOtherUsers(otherUsers, stream) {
//     if (!otherUsers.length) {
//         isAdmin = true;
//     }
//     otherUsers.forEach(userIdToCall => {
//         const peer = createPeer(userIdToCall);
//         teampeer[userIdToCall] = peer;
//         stream.getTracks().forEach(track => {
//             peer.addTrack(track, stream);
//         });
//     });
// }

// function createPeer(userIdToCall) {
//     const peer = new RTCPeerConnection({
//         iceServers: [
//             {
//                 urls: "stun:stun.stunprotocol.org"
//             }
//         ]
//     });
//     peer.onnegotiationneeded = () => userIdToCall ? handleNegotiationNeededEvent(peer, userIdToCall) : null;
//     peer.onicecandidate = handleICECandidateEvent;
//     peer.ontrack = (e) => {
//         const container = document.createElement('div');
//         container.classList.add('remote-video-container');
//         const video = document.createElement('video');
//         video.srcObject = e.streams[0];
//         video.autoplay = true;
//         video.playsInline = true;
//         video.classList.add("remote-video");
//         container.appendChild(video);
//         if (isAdmin) {
//             const button = document.createElement("button");
//             button.innerHTML = `Hide user's cam`;
//             button.classList.add('button');
//             button.setAttribute('user-id', userIdToCall);
//             container.appendChild(button);
//         }
//         container.id = userIdToCall;
//         remoteVideoContainer.appendChild(container);
//     }
//     return peer;
// }

// async function handleNegotiationNeededEvent(peer, userIdToCall) {
//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     const payload = {
//         sdp: peer.localDescription,
//         userIdToCall,
//     };

//     socket.emit('peer connection request', payload);
// }

// async function handleReceiveOffer({ sdp, callerId }, stream) {
//     const peer = createPeer(callerId);
//     teampeer[callerId] = peer;
//     const desc = new RTCSessionDescription(sdp);
//     await peer.setRemoteDescription(desc);

//     stream.getTracks().forEach(track => {
//         peer.addTrack(track, stream);
//     });

//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);

//     const payload = {
//         userToAnswerTo: callerId,
//         sdp: peer.localDescription,
//     };

//     socket.emit('connection answer', payload);
// }

// function handleAnswer({ sdp, answererId }) {
//     const desc = new RTCSessionDescription(sdp);
//     teampeer[answererId].setRemoteDescription(desc).catch(e => console.log(e));
// }

// function handleICECandidateEvent(e) {
//     if (e.candidate) {
//         Object.keys(teampeer).forEach(id => {
//             const payload = {
//                 target: id,
//                 candidate: e.candidate,
//             }
//             socket.emit("ice-candidate", payload);
//         });
//     }
// }

// function handleReceiveIce({ candidate, from }) {
//     const inComingCandidate = new RTCIceCandidate(candidate);
//     teampeer[from].addIceCandidate(inComingCandidate);
// };

// function handleDisconnect(userId) {
//     delete teampeer[userId];
//     document.getElementById(userId).remove();
// };

// // Mute/Hide Vide&Audio Function
// // toggleButton.addEventListener('click', () => {
// //     const videoTrack = userStream.getTracks().find(track => track.kind === 'video');
// //     if (videoTrack.enabled) {
// //         videoTrack.enabled = false;
// //         toggleButton.innerHTML = 'Show cam'
// //     } else {
// //         videoTrack.enabled = true;
// //         toggleButton.innerHTML = "Hide cam"
// //     }
// // });

// // Mute Remote Video&Audio Function
// // remoteVideoContainer.addEventListener('click', (e) => {
// //     if (e.target.innerHTML.includes('Hide')) {
// //         e.target.innerHTML = 'show remote cam';
// //         socket.emit('hide remote cam', e.target.getAttribute('user-id'));
// //     } else {
// //         e.target.innerHTML = `Hide user's cam`;
// //         socket.emit('show remote cam', e.target.getAttribute('user-id'));
// //     }
// // })

// function hideCam() {
//     const videoTrack = userStream.getTracks().find(track => track.kind === 'video');
//     videoTrack.enabled = false;
// }

// function showCam() {
//     const videoTrack = userStream.getTracks().find(track => track.kind === 'video');
//     videoTrack.enabled = true;
// }

// async function init() {
//     socket.on('connect', async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         userStream = stream;
//         userVideo.srcObject = stream;
//         socket.emit('user joined room', ROOM_ID);

//         socket.on('all other users', (otherUsers) => callOtherUsers(otherUsers, stream));

//         socket.on("connection offer", (payload) => handleReceiveOffer(payload, stream));

//         // socket.on('connection answer', handleAnswer);
//         socket.on('connection answer', (sdp, answererId) => handleAnswer(sdp, answererId));

//         socket.on('ice-candidate', handleReceiveIce);

//         socket.on('user disconnected', (userId) => handleDisconnect(userId));

//         socket.on('hide cam', hideCam);

//         socket.on("show cam", showCam);

//         socket.on('server is full', () => alert("chat is full"));
//     });
// }

// init();

async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

peerObj.on("open", function (id) {
    console.log("peerObj open event (id):", id);
});

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

    videoSocket.emit('connectNewStream', ROOM_ID, userID, myUserData); //Set up socket.io

})

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
    }
})

videoSocket.on('user-disconnected', (peerId, data, roomid, userdata) => {
    console.log("Disconnect Event (peerId): ", userdata.name);
    Room = data;
    try {
        let videoDiv = document.getElementById("video#" + peerId)
        if (videoDiv.parentElement != null)
            videoDiv.parentElement.remove();
    } catch (e) {
        // console.log(e);
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

videoSocket.on('drawImageToCanvas', (imagesrc, trgtCanvas, roomId, userId, imageSent2Canvas) => {
    if (ROOM_ID == roomId && userID != userId) {
        let x = imageSent2Canvas.x;
        let y = imageSent2Canvas.y;
        let w = 64, h = 64;
        let targetCanvas = document.getElementById(trgtCanvas);

        console.log("IS2C", imageSent2Canvas);
        console.log("image sent by: ", userId);
        console.log("drawing image:", imagesrc, " on canvas: ", trgtCanvas, "at :", `(${x},${y})`);
        console.log("Target canvas: ", targetCanvas);

        imgSentToCanvas = new component(w, h, `${imagesrc}`, x - w / 2, y - h / 2, "image", targetCanvas, userID);
        imgSentToCanvas.update();
        sentImages.push(imgSentToCanvas);
    }
})

setTimeout(updateRoom, 5000);

var showsettings = 1;
document.getElementById("settingsBtn").addEventListener("click", () => {
    var setting = document.getElementById("settings")
    if (showsettings) {
        setting.style.display = "none";
        showsettings = 0;
        document.getElementById("video").muted = true;
    } else {
        setting.style.display = "block"
        showsettings = 1;
        document.getElementById("video").muted = false;
    }

})


async function videoCallUser(peerObjId) { //other user's peerObjid is automaticall passed in as arguement

    // grab the camera and mic
    const myStream = document.getElementById("video").srcObject;
    // switch to the video call and play the camera preview
    let title = "video#" + userID;
    if (document.getElementById(title) == null) {
        // let div = document.createElement("div");
        // let video = document.createElement("video");
        // let header = document.createElement("header");
        // header.innerText = "Self: " + title;
        // video.id = title;
        // video.srcObject = myStream;
        // video.play();
        // let livefeedDiv = document.getElementById("videoTable");
        // div.appendChild(header);
        // div.appendChild(video);
        // livefeedDiv.appendChild(div);
        addSelfVideoStream(myStream, myUserData)
    }
    // make the call
    const call = peerObj.call(peerObjId, myStream);
    call.on("stream", (stream) => {
        let title = "video#" + call.peer;
        if (document.getElementById(title) == null) { //check for duplicates
            // let div = document.createElement("div");
            // let video = document.createElement("video");
            // let header = document.createElement("header");
            // header.innerText = "Remote:" + title;
            // video.id = title;
            // video.srcObject = stream;
            // video.play();
            // let livefeedDiv = document.getElementById("videoTable");
            // div.appendChild(header);
            // div.appendChild(video);
            // livefeedDiv.appendChild(div);
            addSelfVideoStream(stream, getUserDatabyUserId(call.peer));
        }
    });
    call.on("data", (stream) => {
        let title = "video#" + call.peer;
        if (document.getElementById(title) == null) { //check for duplicates video elements
            // let div = document.createElement("div");
            // let video = document.createElement("video");
            // let header = document.createElement("header");
            // header.innerText = "Remote:" + title;
            // video.id = title;
            // video.srcObject = stream;
            // video.play();
            // let livefeedDiv = document.getElementById("videoTable");
            // div.appendChild(header);
            // div.appendChild(video);
            // livefeedDiv.appendChild(div);
            addSelfVideoStream(stream, getUserDatabyUserId(call.peer));
        }
    });
    call.on("error", (err) => {
        console.log(err);
    });
    call.on('close', () => {
        endCall(call.peer)
    })
    // save the close function
    user_Peers[call.peer] = call;
}


peerObj.on("call", (call) => {
    if (confirm(`Accept call from ${call.peer}?`)) {
        // grab the camera and mic
        // navigator.mediaDevices
        //     .getUserMedia({ video: true, audio: true })
        //     .then((GUMstream) => {
        const myStream = document.getElementById("video").srcObject;
        // switch to the video call and play the camera preview
        // document.getElementById("local-video").srcObject = stream;
        // document.getElementById("local-video").play();
        // play the local preview
        let id = "video#" + userID;
        if (document.getElementById(id) == null) {
            // let div = document.createElement("div");
            // let video = document.createElement("video");
            // let header = document.createElement("header");
            // header.innerText = "Self:" + id;
            // video.id = id;
            // video.srcObject = myStream;
            // video.play();
            // let livefeedDiv = document.getElementById("videoTable");
            // div.appendChild(header);
            // div.appendChild(video);
            // livefeedDiv.appendChild(div);
            addSelfVideoStream(myStream, myUserData);
        }


        // answer the call
        call.answer(myStream);

        //remove the preview stream
        //document.getElementById('video').style.display = "none";

        // save the close function
        user_Peers[call.peer] = call;


        call.on("stream", (remoteStream) => {
            let title = "video#" + call.peer;
            if (document.getElementById(title) == null) {
                // when we receive the remote stream, play it
                // let div = document.createElement("div");
                // let video = document.createElement("video");
                // let header = document.createElement("header");
                // header.innerText = "Remote:" + title;
                // video.id = title;
                // video.srcObject = remoteStream;
                // video.play();
                // let livefeedDiv = document.getElementById("videoTable");
                // div.appendChild(header);
                // div.appendChild(video);
                // livefeedDiv.appendChild(div);
                addSelfVideoStream(remoteStream, getUserDatabyUserId(call.peer));
            }


            //   document.getElementById("remote-video").srcObject = remoteStream;
            //   document.getElementById("remote-video").play();
        });
        // })
        // .catch((err) => {
        //     console.log("Failed to get local stream:", err);
        // });
    } else {
        // user rejected the call, close it
        call.close();
    }
});


function endCall(peerObjid) {
    // Go Delete ended user element
    let title = "video#" + peerObjid;
    document.getElementById(title).remove()

    // If there is no current call, return
    if (!user_Peers[peerObjid]) return;
    // Close the call, and reset the function
    try {
        user_Peers[peerObjid].close();
    } catch { }
    user_Peers[peerObjid] = undefined;
}


function addSelfVideoStream(stream, userData) { //Draw video to canvas element then append that to the DOM
    // var uname = userData.name; 
    // var userTeam = userData.userTeam;

    if (document.getElementById("canvas#" + userData.name) != null)
        return 0;

    var video = document.createElement('video');
    var canvas = document.createElement("canvas");

    video.srcObject = stream

    canvas.clicked = false;
    canvas.id = 'canvas#' + userData.name;
    let w = 300, h = 220;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w;
    canvas.style.height = h;
    canvas.xcursor = w / 2;
    canvas.ycursor = h / 2;
    var context = canvas.getContext('2d');
    focusedCanvas = canvas.id;

    canvas.addEventListener("click", (e) => {
        console.log("Old focusedCanvas = ", focusedCanvas);
        if (focusedCanvas != null || focusedCanvas != "") {
            document.getElementById(focusedCanvas).style = "";
        }
        getClickedSpot(canvas, e);
        focusedCanvas = canvas.id;
        canvas.clicked = !canvas.clicked;
        let sty = "border-left: 5px solid #E3555E; padding: 5px; background-color: #d1f7fa; color: #434343;"
        if (canvas.clicked)
            canvas.style = sty;
        else
            canvas.style = "";
        console.log("New focusedCanvas = ", canvas.id);
    });


    var videoID;
    video.id = videoID = "video#" + userData.name;
    // video.srcObject = stream

    video.addEventListener('loadedmetadata', () => {
        console.log("User " + userData.name + "'s Video play event. ");
        video.play();
    })

    // changed
    video.addEventListener('play', function () {
        draw(this, context, 300, 230, canvas.id, userData);
    }, false);

    var tbl = document.getElementById("videoTable");
    var tdc = document.createElement("td");
    var muteBtn = document.createElement("button");
    muteBtn.innerText = "Mute";
    var removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    var buttonDiv = document.createElement("div");

    muteBtn.addEventListener("click", function (userData) {
        let videoAudio = document.getElementById("video#" + userData.name);

        if (videoAudio.muted == false)
            videoAudio.muted = true;
        else
            videoAudio.muted = false;
    })

    removeBtn.addEventListener("click", function () {

        tdc.remove();
    })

    buttonDiv.appendChild(removeBtn);
    buttonDiv.appendChild(muteBtn);


    // tdc.appendChild(d);
    tdc.id = "td#" + userData.name;
    tdc.appendChild(video);
    tdc.appendChild(buttonDiv)
    tdc.appendChild(canvas);
    tbl.appendChild(tdc);
}

function getClickedSpot(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    canvas.xcursor = Math.round(x);
    canvas.ycursor = Math.round(y);
    console.log("Coordinate x: " + x, "Coordinate y: " + y);
}

//added these functions below
function draw(video, context, width, height, id, userData) {

    var canvas = document.getElementById(id);
    var ctxt = canvas.getContext('2d');
    ctxt.drawImage(video, 0, 0, width, height);

    if (sentImages.length > 6) {
        sentImages[0].remove();
    }
    Circle(canvas)

    sentImages.forEach((item, index) => {
        item.update();
    })

    drawHUD(canvas, userData);
    if (imgSentToCanvas != null) {
        imgSentToCanvas.update();
    }

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

function updateAnimation() {
    if (mode == 0) {
        posX--;
    }
    else if (mode == 1) {
        posX++;
    }

    if (posX > 10) {
        mode = 0;
    }
    if (posX < -10) {
        mode = 1;
    }
    setTimeout(updateAnimation, 25);
}
updateAnimation();

function Circle(canvas) {

    var context = canvas.getContext('2d');
    var centerX = canvas.xcursor;
    var centerY = canvas.ycursor;
    var radius = 10 + posX / 2;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();



}

function component(width, height, color, x, y, type, canvas, from) {
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
    if (from == null) this.from = "";
    else this.from = from;
    console.log("canvas: ", canvas)
    this.update = function () {
        ctx = canvas.getContext('2d');
        if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (from != null) {
                context.fillStyle = 'white';
                ctx.strokeStyle = '#003300';
                ctx.font = '10px Arial';
                ctx.fillText(from, x - width / 2, y + height);
            }

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
                    var image = document.createElement("img");
                    image.src = `../images/${match}`;
                    image.height = 64;
                    image.width = 64;
                    imagePrevDiv.appendChild(image);
                    image.style = "padding: 2px"

                    image.addEventListener("dblclick", () => {
                        if (document.getElementById(focusedCanvas) == null) {
                            console.log("Click a video stream first")
                        } else {
                            targetCanvas = document.getElementById(focusedCanvas);

                            console.log("adding image to target canvas: ", focusedCanvas);
                            console.log("TRGT_CANVAS: ", targetCanvas)

                            imgSentToCanvas = new component(64, 64, `${image.src}`, targetCanvas.xcursor, targetCanvas.ycursor, "image", targetCanvas, userID);
                            imgSentToCanvas.update();
                            videoSocket.emit("sendImageToCanvas", image.src, focusedCanvas, ROOM_ID, userID, imgSentToCanvas);
                        }
                    })
                    image.addEventListener("click", () => {
                        if (modeToggle == "library") {

                            console.log("adding image to from Library to screen: ", image);
                            if (document.getElementById(focusedCanvas) == null) {
                                console.log("Click a video stream first")
                            } else {
                                let w = h = 64;
                                targetCanvas = document.getElementById(focusedCanvas);
                                imgSentToCanvas = new component(w, h, `${image.src}`, targetCanvas.xcursor - w / 2, targetCanvas.ycursor - h / 2, "image", targetCanvas, userID);
                                imgSentToCanvas.update();
                                videoSocket.emit("sendImageToCanvas", image.src, focusedCanvas, ROOM_ID, userID, imgSentToCanvas)
                            }
                        } else {
                            console.log("adding image to library: ", image);
                            library["images"].push(image);
                        }

                    })
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

}