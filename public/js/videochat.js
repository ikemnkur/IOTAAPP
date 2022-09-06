const vSocket = io('/');
const PRE = "DELTA"
const SUF = "MEET"
const roomJSONText = document.getElementById("roomJSON");
const userJSONText = document.getElementById("userJSON");
var roomOBJ = JSON.parse(roomJSONText.innerText);
var userOBJ = JSON.parse(userJSONText.innerText);
var room_id = roomOBJ[0]["roomID"], user_id = userOBJ[0]["username"], currentUsers;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
var screenStream;
var peer = null;
var currentPeer = null
var screenSharing = false
let host = document.getElementById("host").innerText; 
let user = document.getElementById("user").innerText; 

vSocket.emit('join-room', room_id, user_id);

vSocket.on('activeUsers', (roomInfo) => {
    console.log("Current users:", roomInfo);
    currentUsers=roomInfo;
})

vSocket.on('user-connected', (userId) => {
    console.log("User id: ", userId, "joined the room");
    vSocket.emit('setUsers', (roomId, user_id));
})

vSocket.on('user-disconnected', (userId, roomInfo) => {
    console.log("User id: ", userId, "left the room");
    currentUsers = roomInfo;
})

// if(host == user){
    // while(activeUsers == undefined){}
if(activeUsers.length == 1){
    createRoom(); 
    console.log("You have created/hosted a room.");
} else {
    joinRoom(); 
    console.log("You have joined a room.");
}

function createRoom() {
    console.log("Creating Room")
    // let room = document.getElementById("room-input").innerText;
    // if (room == " " || room == "") {
    //     alert("Please enter room number")
    //     return;
    // }
    // room_id = PRE + room + SUF; 
    // room_id = room;
    peer = new Peer(room_id)
    peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id)
        hideModal()
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
        }, (err) => {
            console.log(err)
        })
        notify("Waiting for peer to join.")
    })
    peer.on('call', (call) => {
        call.answer(local_stream);
        call.on('stream', (stream) => {
            // setRemoteStream(stream)
            var item = activeUsers.pop();
            activeUsers.push(item);
            addUserStream(stream, item.username)
        })
        currentPeer = call;
    })
}

function addUserStream(stream, otherId) {
    let video = document.createElement("video");
    video.id = otherId+"#video";
    video.srcObject = stream;
    video.muted = true;
    video.play();
    // video.addEventListener('play', function () {
    //     draw(this, context, 200, 150);
    // }, false);
    let view = document.getElementById("meet-area");
    view.append(video);
}

function setLocalStream(stream) {

    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}
function setRemoteStream(stream) {

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
}

function hideModal() {
    document.getElementById("entry-modal").hidden = true
}

function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

function joinRoom() {
    console.log("Joining Room")
    let room = document.getElementById("room-input").innerText; 
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    //room_id = PRE + room + SUF;
    room_id = room;
    hideModal()
    peer = new Peer()
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id)
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
            notify("Joining peer")
            let call = peer.call(room_id, stream)
            call.on('stream', (stream) => {
                // setRemoteStream(stream, id);
                var item = activeUsers.pop();
                activeUsers.push(item);
                addUserStream(stream, item.username)
            })
            currentPeer = call;
        }, (err) => {
            console.log(err)
        })

    })
}

function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing()
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            stopScreenSharing()
        }
        if (peer) {
            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack)
            screenSharing = true
        }
        console.log(screenStream)
    })
}

function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = local_stream.getVideoTracks()[0];
    if (peer) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack)
    }
    screenStream.getTracks().forEach(function (track) {
        track.stop();
    });
    screenSharing = false
}