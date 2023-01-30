// const e = require("express");

const videoSocket = io('/');

const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')
const myCanvas = document.createElement('canvas')
myVideo.muted = true
var action = "change";
var peers = {};
var streams = {};
var socketid = "";
var mode = 0, posX = 0, step = 0;
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



const GIF = function () {
    // **NOT** for commercial use.
    var timerID;                          // timer handle for set time out usage
    var st;                               // holds the stream object when loading.
    var interlaceOffsets = [0, 4, 2, 1]; // used in de-interlacing.
    var interlaceSteps = [8, 8, 4, 2];
    var interlacedBufSize;  // this holds a buffer to de interlace. Created on the first frame and when size changed
    var deinterlaceBuf;
    var pixelBufSize;    // this holds a buffer for pixels. Created on the first frame and when size changed
    var pixelBuf;
    const GIF_FILE = { // gif file data headers
        GCExt: 0xF9,
        COMMENT: 0xFE,
        APPExt: 0xFF,
        UNKNOWN: 0x01, // not sure what this is but need to skip it in parser
        IMAGE: 0x2C,
        EOF: 59,   // This is entered as decimal
        EXT: 0x21,
    };
    // simple buffered stream used to read from the file 
    var Stream = function (data) {
        this.data = new Uint8ClampedArray(data);
        this.pos = 0;
        var len = this.data.length;
        this.getString = function (count) { // returns a string from current pos of len count
            var s = "";
            while (count--) { s += String.fromCharCode(this.data[this.pos++]) }
            return s;
        };
        this.readSubBlocks = function () { // reads a set of blocks as a string
            var size, count, data = "";
            do {
                count = size = this.data[this.pos++];
                while (count--) { data += String.fromCharCode(this.data[this.pos++]) }
            } while (size !== 0 && this.pos < len);
            return data;
        }
        this.readSubBlocksB = function () { // reads a set of blocks as binary
            var size, count, data = [];
            do {
                count = size = this.data[this.pos++];
                while (count--) { data.push(this.data[this.pos++]); }
            } while (size !== 0 && this.pos < len);
            return data;
        }
    };
    // LZW decoder uncompressed each frames pixels
    // this needs to be optimised.
    // minSize is the min dictionary as powers of two
    // size and data is the compressed pixels
    function lzwDecode(minSize, data) {
        var i, pixelPos, pos, clear, eod, size, done, dic, code, last, d, len;
        pos = pixelPos = 0;
        dic = [];
        clear = 1 << minSize;
        eod = clear + 1;
        size = minSize + 1;
        done = false;
        while (!done) { // JavaScript optimisers like a clear exit though I never use 'done' apart from fooling the optimiser
            last = code;
            code = 0;
            for (i = 0; i < size; i++) {
                if (data[pos >> 3] & (1 << (pos & 7))) { code |= 1 << i }
                pos++;
            }
            if (code === clear) { // clear and reset the dictionary
                dic = [];
                size = minSize + 1;
                for (i = 0; i < clear; i++) { dic[i] = [i] }
                dic[clear] = [];
                dic[eod] = null;
            } else {
                if (code === eod) { done = true; return }
                if (code >= dic.length) { dic.push(dic[last].concat(dic[last][0])) }
                else if (last !== clear) { dic.push(dic[last].concat(dic[code][0])) }
                d = dic[code];
                len = d.length;
                for (i = 0; i < len; i++) { pixelBuf[pixelPos++] = d[i] }
                if (dic.length === (1 << size) && size < 12) { size++ }
            }
        }
    };
    function parseColourTable(count) { // get a colour table of length count  Each entry is 3 bytes, for RGB.
        var colours = [];
        for (var i = 0; i < count; i++) { colours.push([st.data[st.pos++], st.data[st.pos++], st.data[st.pos++]]) }
        return colours;
    }
    function parse() {        // read the header. This is the starting point of the decode and async calls parseBlock
        var bitField;
        st.pos += 6;
        gif.width = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
        gif.height = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
        bitField = st.data[st.pos++];
        gif.colorRes = (bitField & 0b1110000) >> 4;
        gif.globalColourCount = 1 << ((bitField & 0b111) + 1);
        gif.bgColourIndex = st.data[st.pos++];
        st.pos++;                    // ignoring pixel aspect ratio. if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
        if (bitField & 0b10000000) { gif.globalColourTable = parseColourTable(gif.globalColourCount) } // global colour flag
        setTimeout(parseBlock, 0);
    }
    function parseAppExt() { // get application specific data. Netscape added iterations and terminator. Ignoring that
        st.pos += 1;
        if ('NETSCAPE' === st.getString(8)) { st.pos += 8 }  // ignoring this data. iterations (word) and terminator (byte)
        else {
            st.pos += 3;            // 3 bytes of string usually "2.0" when identifier is NETSCAPE
            st.readSubBlocks();     // unknown app extension
        }
    };
    function parseGCExt() { // get GC data
        var bitField;
        st.pos++;
        bitField = st.data[st.pos++];
        gif.disposalMethod = (bitField & 0b11100) >> 2;
        gif.transparencyGiven = bitField & 0b1 ? true : false; // ignoring bit two that is marked as  userInput???
        gif.delayTime = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
        gif.transparencyIndex = st.data[st.pos++];
        st.pos++;
    };
    function parseImg() {                           // decodes image data to create the indexed pixel image
        var deinterlace, frame, bitField;
        deinterlace = function (width) {                   // de interlace pixel data if needed
            var lines, fromLine, pass, toline;
            lines = pixelBufSize / width;
            fromLine = 0;
            if (interlacedBufSize !== pixelBufSize) {      // create the buffer if size changed or undefined.
                deinterlaceBuf = new Uint8Array(pixelBufSize);
                interlacedBufSize = pixelBufSize;
            }
            for (pass = 0; pass < 4; pass++) {
                for (toLine = interlaceOffsets[pass]; toLine < lines; toLine += interlaceSteps[pass]) {
                    deinterlaceBuf.set(pixelBuf.subarray(fromLine, fromLine + width), toLine * width);
                    fromLine += width;
                }
            }
        };
        frame = {}
        gif.frames.push(frame);
        frame.disposalMethod = gif.disposalMethod;
        frame.time = gif.length;
        frame.delay = gif.delayTime * 10;
        gif.length += frame.delay;
        if (gif.transparencyGiven) { frame.transparencyIndex = gif.transparencyIndex }
        else { frame.transparencyIndex = undefined }
        frame.leftPos = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
        frame.topPos = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
        frame.width = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
        frame.height = (st.data[st.pos++]) + ((st.data[st.pos++]) << 8);
        bitField = st.data[st.pos++];
        frame.localColourTableFlag = bitField & 0b10000000 ? true : false;
        if (frame.localColourTableFlag) { frame.localColourTable = parseColourTable(1 << ((bitField & 0b111) + 1)) }
        if (pixelBufSize !== frame.width * frame.height) { // create a pixel buffer if not yet created or if current frame size is different from previous
            pixelBuf = new Uint8Array(frame.width * frame.height);
            pixelBufSize = frame.width * frame.height;
        }
        lzwDecode(st.data[st.pos++], st.readSubBlocksB()); // decode the pixels
        if (bitField & 0b1000000) {                        // de interlace if needed
            frame.interlaced = true;
            deinterlace(frame.width);
        } else { frame.interlaced = false }
        processFrame(frame);                               // convert to canvas image
    };
    function processFrame(frame) { // creates a RGBA canvas image from the indexed pixel data.
        var ct, cData, dat, pixCount, ind, useT, i, pixel, pDat, col, frame, ti;
        frame.image = document.createElement('canvas');
        frame.image.width = gif.width;
        frame.image.height = gif.height;
        frame.image.ctx = frame.image.getContext("2d");
        ct = frame.localColourTableFlag ? frame.localColourTable : gif.globalColourTable;
        if (gif.lastFrame === null) { gif.lastFrame = frame }
        useT = (gif.lastFrame.disposalMethod === 2 || gif.lastFrame.disposalMethod === 3) ? true : false;
        if (!useT) { frame.image.ctx.drawImage(gif.lastFrame.image, 0, 0, gif.width, gif.height) }
        cData = frame.image.ctx.getImageData(frame.leftPos, frame.topPos, frame.width, frame.height);
        ti = frame.transparencyIndex;
        dat = cData.data;
        if (frame.interlaced) { pDat = deinterlaceBuf }
        else { pDat = pixelBuf }
        pixCount = pDat.length;
        ind = 0;
        for (i = 0; i < pixCount; i++) {
            pixel = pDat[i];
            col = ct[pixel];
            if (ti !== pixel) {
                dat[ind++] = col[0];
                dat[ind++] = col[1];
                dat[ind++] = col[2];
                dat[ind++] = 255;      // Opaque.
            } else
                if (useT) {
                    dat[ind + 3] = 0; // Transparent.
                    ind += 4;
                } else { ind += 4 }
        }
        frame.image.ctx.putImageData(cData, frame.leftPos, frame.topPos);
        gif.lastFrame = frame;
        if (!gif.waitTillDone && typeof gif.onload === "function") { doOnloadEvent() }// if !waitTillDone the call onload now after first frame is loaded
    };
    // **NOT** for commercial use.
    function finnished() { // called when the load has completed
        gif.loading = false;
        gif.frameCount = gif.frames.length;
        gif.lastFrame = null;
        st = undefined;
        gif.complete = true;
        gif.disposalMethod = undefined;
        gif.transparencyGiven = undefined;
        gif.delayTime = undefined;
        gif.transparencyIndex = undefined;
        gif.waitTillDone = undefined;
        pixelBuf = undefined; // dereference pixel buffer
        deinterlaceBuf = undefined; // dereference interlace buff (may or may not be used);
        pixelBufSize = undefined;
        deinterlaceBuf = undefined;
        gif.currentFrame = 0;
        if (gif.frames.length > 0) { gif.image = gif.frames[0].image }
        doOnloadEvent();
        if (typeof gif.onloadall === "function") {
            (gif.onloadall.bind(gif))({ type: 'loadall', path: [gif] });
        }
        if (gif.playOnLoad) { gif.play() }
    }
    function canceled() { // called if the load has been cancelled
        finnished();
        if (typeof gif.cancelCallback === "function") { (gif.cancelCallback.bind(gif))({ type: 'canceled', path: [gif] }) }
    }
    function parseExt() {              // parse extended blocks
        const blockID = st.data[st.pos++];
        if (blockID === GIF_FILE.GCExt) { parseGCExt() }
        else if (blockID === GIF_FILE.COMMENT) { gif.comment += st.readSubBlocks() }
        else if (blockID === GIF_FILE.APPExt) { parseAppExt() }
        else {
            if (blockID === GIF_FILE.UNKNOWN) { st.pos += 13; } // skip unknow block
            st.readSubBlocks();
        }

    }
    function parseBlock() { // parsing the blocks
        if (gif.cancel !== undefined && gif.cancel === true) { canceled(); return }

        const blockId = st.data[st.pos++];
        if (blockId === GIF_FILE.IMAGE) { // image block
            parseImg();
            if (gif.firstFrameOnly) { finnished(); return }
        } else if (blockId === GIF_FILE.EOF) { finnished(); return }
        else { parseExt() }
        if (typeof gif.onprogress === "function") {
            gif.onprogress({ bytesRead: st.pos, totalBytes: st.data.length, frame: gif.frames.length });
        }
        setTimeout(parseBlock, 0); // parsing frame async so processes can get some time in.
    };
    function cancelLoad(callback) { // cancels the loading. This will cancel the load before the next frame is decoded
        if (gif.complete) { return false }
        gif.cancelCallback = callback;
        gif.cancel = true;
        return true;
    }
    function error(type) {
        if (typeof gif.onerror === "function") { (gif.onerror.bind(this))({ type: type, path: [this] }) }
        gif.onload = gif.onerror = undefined;
        gif.loading = false;
    }
    function doOnloadEvent() { // fire onload event if set
        gif.currentFrame = 0;
        gif.nextFrameAt = gif.lastFrameAt = new Date().valueOf(); // just sets the time now
        if (typeof gif.onload === "function") { (gif.onload.bind(gif))({ type: 'load', path: [gif] }) }
        gif.onerror = gif.onload = undefined;
    }
    function dataLoaded(data) { // Data loaded create stream and parse
        st = new Stream(data);
        parse();
    }
    function loadGif(filename) { // starts the load
        var ajax = new XMLHttpRequest();
        ajax.responseType = "arraybuffer";
        ajax.onload = function (e) {
            if (e.target.status === 404) { error("File not found") }
            else if (e.target.status >= 200 && e.target.status < 300) { dataLoaded(ajax.response) }
            else { error("Loading error : " + e.target.status) }
        };
        ajax.open('GET', filename, true);
        ajax.send();
        ajax.onerror = function (e) { error("File error") };
        this.src = filename;
        this.loading = true;
    }
    function play() { // starts play if paused
        if (!gif.playing) {
            gif.paused = false;
            gif.playing = true;
            playing();
        }
    }
    function pause() { // stops play
        gif.paused = true;
        gif.playing = false;
        clearTimeout(timerID);
    }
    function togglePlay() {
        if (gif.paused || !gif.playing) { gif.play() }
        else { gif.pause() }
    }
    function seekFrame(frame) { // seeks to frame number.
        clearTimeout(timerID);
        gif.currentFrame = frame % gif.frames.length;
        if (gif.playing) { playing() }
        else { gif.image = gif.frames[gif.currentFrame].image }
    }
    function seek(time) { // time in Seconds  // seek to frame that would be displayed at time
        clearTimeout(timerID);
        if (time < 0) { time = 0 }
        time *= 1000; // in ms
        time %= gif.length;
        var frame = 0;
        while (time > gif.frames[frame].time + gif.frames[frame].delay && frame < gif.frames.length) { frame += 1 }
        gif.currentFrame = frame;
        if (gif.playing) { playing() }
        else { gif.image = gif.frames[gif.currentFrame].image }
    }
    function playing() {
        var delay;
        var frame;
        if (gif.playSpeed === 0) {
            gif.pause();
            return;
        } else {
            if (gif.playSpeed < 0) {
                gif.currentFrame -= 1;
                if (gif.currentFrame < 0) { gif.currentFrame = gif.frames.length - 1 }
                frame = gif.currentFrame;
                frame -= 1;
                if (frame < 0) { frame = gif.frames.length - 1 }
                delay = -gif.frames[frame].delay * 1 / gif.playSpeed;
            } else {
                gif.currentFrame += 1;
                gif.currentFrame %= gif.frames.length;
                delay = gif.frames[gif.currentFrame].delay * 1 / gif.playSpeed;
            }
            gif.image = gif.frames[gif.currentFrame].image;
            timerID = setTimeout(playing, delay);
        }
    }
    var gif = {                      // the gif image object
        onload: null,       // fire on load. Use waitTillDone = true to have load fire at end or false to fire on first frame
        onerror: null,       // fires on error
        onprogress: null,       // fires a load progress event
        onloadall: null,       // event fires when all frames have loaded and gif is ready
        paused: false,      // true if paused
        playing: false,      // true if playing
        waitTillDone: true,       // If true onload will fire when all frames loaded, if false, onload will fire when first frame has loaded
        loading: false,      // true if still loading
        firstFrameOnly: false,      // if true only load the first frame
        width: null,       // width in pixels
        height: null,       // height in pixels
        frames: [],         // array of frames
        comment: "",         // comments if found in file. Note I remember that some gifs have comments per frame if so this will be all comment concatenated
        length: 0,          // gif length in ms (1/1000 second)
        currentFrame: 0,          // current frame. 
        frameCount: 0,          // number of frames
        playSpeed: 1,          // play speed 1 normal, 2 twice 0.5 half, -1 reverse etc...
        lastFrame: null,       // temp hold last frame loaded so you can display the gif as it loads
        image: null,       // the current image at the currentFrame
        playOnLoad: true,       // if true starts playback when loaded
        // functions
        load: loadGif,    // call this to load a file
        cancel: cancelLoad, // call to stop loading
        play: play,       // call to start play
        pause: pause,      // call to pause
        seek: seek,       // call to seek to time
        seekFrame: seekFrame,  // call to seek to frame
        togglePlay: togglePlay, // call to toggle play and pause state
    };
    return gif;
}

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

//Sounds
function playSound(sound) {
    var audio = new Audio(`/sounds/${sound}`);
    // var audio = new Audio(`sounds/GameStart.mp3`);
    audio.play();
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
        // console.log("got room update");
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

videoSocket.on('drawImageToCanvas', (imagesrc, trgtCanvas, roomId, fromUserId, imageSent2Canvas) => {
    if (ROOM_ID == roomId) {
        let x = imageSent2Canvas.x;
        let y = imageSent2Canvas.y;
        let w = 64, h = 64;
        let targetCanvas = document.getElementById(trgtCanvas);
        if (targetCanvas != null) {
            console.log("IS2C", imageSent2Canvas);
            console.log("image sent by: ", fromUserId);
            console.log("drawing image:", imagesrc, " on canvas: ", trgtCanvas, "at :", `(${x},${y})`);
            console.log("Target canvas: ", targetCanvas);

            imgSentToCanvas = new component(w, h, `${imagesrc}`, x - w / 2, y + h / 2, "image", targetCanvas, fromUserId, "N/A", 10000);
            imgSentToCanvas.update();
            if (sentImages.length == 5) {
                sentImages[0] = sentImages[1];
                sentImages[1] = sentImages[2];
                sentImages[2] = sentImages[3];
                sentImages[3] = sentImages[4];
                // sentImages[4] = sentImages[5];
            }
            if (sentImages.length < 5)
                sentImages.push(imgSentToCanvas);
            else
                sentImages[5] = imgSentToCanvas;
        }
    }
})

videoSocket.on('soundToCanvas', (soundsrc, trgtCanvas, roomId, fromUserId, msg) => {
    if (ROOM_ID == roomId) {
        let targetCanvas = document.getElementById(trgtCanvas);
        if (targetCanvas != null) {
            let x = 15, w = 16, h = 16;;
            let y = targetCanvas.height - h;
            console.log("sound sent by: ", fromUserId);
            console.log("playing sound:", soundsrc, " on canvas: ", trgtCanvas, "at :", `(${x},${y})`);
            // console.log("Target canvas: ", targetCanvas);

            imgSentToCanvas = new component(w, h, `/images/soundIcon.png`, x - w / 2, y + h / 2, "image", targetCanvas, fromUserId, msg, 3000);
            imgSentToCanvas.update();
            sentImages.push(imgSentToCanvas);

            playSound(soundsrc);
        }
    }
})

setTimeout(updateRoom, 5000);

var showsettings = 1;
document.getElementById("settingsBtn").addEventListener("click", () => {
    var setting = document.getElementById("settings")
    if (showsettings) {
        setting.style.display = "none";
        showsettings = 0;
        // document.getElementById("video").muted = true;
    } else {
        setting.style.display = "block"
        showsettings = 1;
        // document.getElementById("video").muted = false;
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

    var videoID = "video#" + userData.name;;
    video.id = videoID;
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
    var clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    var buttonDiv = document.createElement("div");

    muteBtn.addEventListener("click", function (userData) {
        let videoAudio = document.getElementById(videoID);

        if (videoAudio.muted == false) {
            videoAudio.muted = true;
            console.log(videoID, "has been muted");
            muteBtn.innerText = "Unmute";
        }
        else {
            console.log(videoID, "has been unmuted");
            videoAudio.muted = false;
            muteBtn.innerText = "Mute";
        }

    })

    removeBtn.addEventListener("click", function () {
        tdc.remove();
    })

    clearBtn.addEventListener("click", function () {
        sentImages = [];
    })

    buttonDiv.appendChild(removeBtn);
    buttonDiv.appendChild(muteBtn);
    buttonDiv.appendChild(clearBtn);

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

    // draw the Icon
    Circle(canvas);

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
    context.fillStyle = 'white';
    context.strokeStyle = '#003300';
    context.font = '16px Arial';
    context.fillText(userData.userTeam, (canvas.width / 2) - (6 * len), 25);

    context.font = '14px Arial';
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

    step++;
    step = step % 10;

    setTimeout(updateAnimation, 25);
}
updateAnimation();

function Circle(canvas) {

    var context = canvas.getContext('2d');
    var centerX = canvas.xcursor;
    var centerY = canvas.ycursor;
    var radius = 5 + posX / 8;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.lineWidth = 2;
    context.strokeStyle = `#${step * 5 + 10}${99 - step * 4}${50 + step * 2}`;
    context.stroke();

}

function component(width, height, color, x, y, type, canvas, from, msg, time) {
    this.type = type;
    this.msg = msg;

    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    console.log("this.image.src:", this.image.src);

    //gif image controls
    this.gif = false;
    this.frames = 1;
    this.itr = 0;
    this.myGif = GIF();

    if (this.image.src.includes(".gif")) {
        this.myGif.load(this.image.src);
        // this.myGif.load("https://upload.wikimedia.org/wikipedia/commons/a/a2/Wax_fire.gif");
        this.gif = true;
        this.frames = this.myGif.frames.length;
    }

    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.kill = false;
    // const d = new Date();
    // this.time = d.getTime();
    // // Calculate milliseconds in a year
    // const second = 1000;
    // const minute = second * 60;
    // const hour = minute * 60;
    // const day = hour * 24;
    // const year = day * 365;
    // let secondOfCreation = Math.round(d.getTime() / second);

    setTimeout(() => {
        this.kill = true;
    }, time)

    if (from == null) this.from = "";
    else this.from = from;
    // console.log("canvas: ", canvas)
    this.update = function () {
        if (this.kill == true) {
            this.gif = false
            return 0;
        }

        ctx = canvas.getContext('2d');

        if (this.gif) {
            if (!this.myGif.loading) {
                ctx.drawImage(this.myGif.image, x + 32, y, 64, 64);
                // drawGifImage(this.myGif.image, x, y, 1, 0, ctx);
                this.itr++;
                if (from != null) {
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = '#003300';
                    ctx.font = '12px Arial';
                    ctx.fillText(from, x + 32, y - 32 + 8);
                }
            }
        } else if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (from != null) {
                ctx.fillStyle = 'white';
                ctx.strokeStyle = '#003300';
                ctx.font = '12px Arial';
                ctx.fillText(from, x + width / 4, y + height + 8);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        this.itr = this.itr % this.frames;
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }

}

if (1) {

    var search = document.getElementById("mediaSearch");
    var searchForm = document.getElementById("searchForm");
    var fullImgList = {}; // list of imgs
    var fullSndList = {};
    var library = {};
    library["images"] = [];
    library["sounds"] = [];

    var modeToggle = "search", mediaType = "Image";
    var mediaTypeBtn = document.getElementById("addToLibBtn")
    var mediaTypeText = document.getElementById("addToLibText")
    var modeToggleBtn = document.getElementById("searchModeBtn")
    var modeToggleText = document.getElementById("searchModeText")
    var addBtn = document.getElementById("addToLibBtn")
    var imagePrevDiv = document.getElementById("imgPrevDiv");

    if (fullImgList.length == undefined || fullSndList.length == undefined) {
        videoSocket.emit("fetchMedia", ROOM_ID, userID);
    }

    search.addEventListener("keyup", () => {
        console.log("searching....");
        previewImg(search.value);
    })


    videoSocket.on("fetchMediaList", (img, snd) => {
        fullImgList = img;
        fullSndList = snd;
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
            let matches;
            let cntrCvnX = 125 - 8; cntrCvnY = 150 - 16;

            if (modeToggle == "library") {
                matches = searchLibrary(searchTerm, mediaTypeText.innerText);
            } else {
                matches = searchMedia(searchTerm, mediaTypeText.innerText);
            }

            if (focusedCanvas == null) {
                focusedCanvas = myCanvas.id;
                targetCanvas = document.getElementById(focusedCanvas);
            } else {
                if (targetCanvas != null) {
                    console.log("Focused on Canvas: ", targetCanvas);
                    cntrCvnX = targetCanvas.width / 2 - 32;
                    cntrCvnY = targetCanvas.height / 2 - 32;
                } else {
                    console.log("Error with the focused Canvas: ", targetCanvas);
                }
            }

            removeAllChildNodes(imagePrevDiv);
            if (matches != 0) {
                console.log(matches)
                matches.forEach(match => {
                    var btnActionTXT = document.getElementById("addToLibText")
                    if (btnActionTXT.innerText == "Image") {
                        if (match != null) {
                            var image = document.createElement("img");
                            image.src = `../images/${match}`;
                            image.height = 64;
                            image.width = 64;
                            imagePrevDiv.appendChild(image);
                            image.style = "padding: 2px"

                            image.addEventListener("dblclick", () => {
                                if (document.getElementById(focusedCanvas) == null) {
                                    console.log("Click a video stream first");
                                    errorMSG("Click a video stream first");
                                } else {
                                    targetCanvas = document.getElementById(focusedCanvas);

                                    console.log("adding image to target canvas: ", focusedCanvas);
                                    console.log("TRGT_CANVAS: ", targetCanvas)

                                    imgSentToCanvas = new component(64, 64, `${image.src}`, targetCanvas.xcursor - 32, targetCanvas.ycursor + 32, "image", targetCanvas, userID, "N/A", 10000);
                                    imgSentToCanvas.update();
                                    videoSocket.emit("sendImageToCanvas", image.src, focusedCanvas, ROOM_ID, userID, imgSentToCanvas);
                                }
                            })

                            image.addEventListener("click", () => {
                                if (modeToggle == "library") {
                                    console.log("adding image to from Library to screen: ", image);
                                    if (document.getElementById(focusedCanvas) == null) {
                                        console.log("Click a video stream first")
                                        showErrorMsg("Click a video stream first")
                                    } else {
                                        let w = h = 64;
                                        targetCanvas = document.getElementById(focusedCanvas);
                                        imgSentToCanvas = new component(w, h, `${image.src}`, targetCanvas.xcursor - w / 2, targetCanvas.ycursor + h / 2, "image", targetCanvas, userID, `from:${userID} `, 10000);
                                        imgSentToCanvas.update();
                                        videoSocket.emit("sendImageToCanvas", image.src, focusedCanvas, ROOM_ID, userID, imgSentToCanvas)
                                    }
                                } else {
                                    console.log("adding image to library: ", image);
                                    library["images"].push(image);
                                }
                            })
                        }
                    } else {
                        // sound manipulation
                        if (match != null) {
                            var thing = document.getElementById("soundElem");

                            var soundElmt = document.createElement("div");
                            soundElmt = thing.cloneNode(true);
                            soundElmt.id = match;
                            let playbtn = soundElmt.querySelector('#playSnd');
                            let sendBtn = soundElmt.querySelector('#sendSnd');
                            let addToLibBtn = soundElmt.querySelector('#addToLib');
                            let soundName = soundElmt.querySelector('#sndName');
                            soundName.innerText = match;
                            let snd = match;

                            if (modeToggle == "library") {
                                addToLibBtn.hidden = true;
                                addToLibBtn.remove();
                            } else {
                                addToLibBtn.hidden = false;
                                addToLibBtn.addEventListener("click", () => {
                                    console.log("adding sound to library: ", snd);
                                    library["sounds"].push(snd);
                                })
                            }

                            playbtn.addEventListener("click", () => {
                                playSound(match);
                            })

                            sendBtn.addEventListener("click", () => {
                                let msg = `from: ${userID}`;
                                videoSocket.emit("sendSoundToCanvas", snd, focusedCanvas, ROOM_ID, userID, msg);
                                console.log("Sending sound: ", snd)
                            })

                            soundElmt.hidden = false;
                            thing.hidden = true;
                            imagePrevDiv.append(soundElmt)
                        }
                    }
                });
            }

        } else {
            showErrorMsg("Type more than 3 characters to start search")
        }
    }

    function showErrorMsg(msg) {
        // var imagePrevDiv = document.getElementById("imgPrevDiv");
        let errorMSG = document.getElementById("errorMsg")
        if (errorMSG == null) {
            errorMSG = document.createElement("strong")
            errorMSG.id = "errorMSG";
        }
        errorMSG.innerText = msg;
        console.log("MSG: ", msg);
        // imagePrevDiv.append(errorMSG);
    }

    // search the user sound and image libraries
    function searchLibrary(search, type) {

        search = search.toLowerCase();

        let x = library[type];
        var matches = [], errored = false;
        console.log("var x:", x)

        try {
            for (i = 0; i < x.length; i++) {
                if (x[i].src.toLowerCase().includes(search)) {
                    matches.push(x[i]);
                }
            }
            console.log("Media type: ", type)
            console.log("Matching Search Results: ", matches)
        } catch (error) {
            showErrorMsg(`The ${type} library is empty.`);
            errored = true;
        }

        if (matches != null || errored) {
            return matches;
        } else {
            return null;
        }
    }

    // JavaScript code
    function searchMedia(search, type) {
        search = search.toLowerCase();
        var x;
        if (type == "Sound") {
            x = fullSndList;
        } else {
            x = fullImgList;
        }
        console.log("Media type: ", type)
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



    //Click on Library/Find Button
    modeToggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        var imgSearchBar = document.getElementById("mediaSearch");
        var ficon = document.getElementById("findIcon");
        if (modeToggle == "search") {
            //switch to library mode
            modeToggle = "library";
            modeToggleText.innerText = "Library";
            ficon.className = "fas fa-book-open";
            removeAllChildNodes(imagePrevDiv);
            imgSearchBar.placeholder = "Search Your Library";

            if (mediaTypeText.innerText == "Sound") {
                if (library["sounds"] != []) {
                    library["sounds"].forEach(snd => {
                        var thing = document.getElementById("soundElem");

                        var soundElmt = document.createElement("div");
                        soundElmt = thing.cloneNode(true);
                        soundElmt.id = snd;
                        let playbtn = soundElmt.querySelector('#playSnd');
                        // let addToLibBtn = soundElmt.querySelector('#addToLib');
                        let soundName = soundElmt.querySelector('#sndName');
                        soundName.innerText = snd;
                        // addToLibBtn.addEventListener("click", () => {
                        //     console.log("adding sound to library: ", snd);
                        //     library["sounds"].push(snd);
                        // })
                        playbtn.addEventListener("click", () => {
                            playSound(snd);
                        })

                        soundElmt.hidden = false;
                        imagePrevDiv.append(soundElmt);
                    });
                }
            } else {
                if (library["images"] != []) {
                    library["images"].forEach(img => {
                        imagePrevDiv.append(img);
                    });
                }
            }


            // imgSearchBar.value = "";
            delay(500);
        } else {
            //switch to search mode
            modeToggle = "search";
            imgSearchBar.placeholder = "Search For Media";
            modeToggleText.innerText = "Find";
            // imgSearchBar.value = "";
            ficon.className = "fas fa-magnifying-glass";
            removeAllChildNodes(imagePrevDiv);
            searchMedia(imgSearchBar.value, mediaType)
        }
        delay(100);
    })

    //Click on Image/Sound Button
    mediaTypeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        var imgSearchBar = document.getElementById("mediaSearch");
        var icon = document.getElementById("mediaIcon");

        if (mediaType == "Sound") {
            mediaType = "Image";
            icon.className = 'fas fa-image';
            mediaTypeText.innerText = "Image";
            removeAllChildNodes(imagePrevDiv);
            previewImg(imgSearchBar.value)
            imgSearchBar.placeholder = "Search For Images";
            showErrorMsg("Search For Images");

            delay(100);
        } else if (mediaType == "Image") {
            mediaType = "Sound";
            icon.className = 'fas fa-volume-down';
            mediaTypeText.innerText = "Sound";
            imgSearchBar.placeholder = "Search For Sounds";
            removeAllChildNodes(imagePrevDiv);
            showErrorMsg("Search For Sounds");
            previewImg(imgSearchBar.value)
        }
        delay(100);
    })

}



// Function draws an image
function drawGifImage(image, x, y, scale, rot, ctx) {
    ctx.setTransform(scale, 0, 0, scale, x, y);
    // ctx.rotate(rot);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
}
// // helper functions
// const rand = (min = 1, max = min + (min = 0)) => Math.random() * (max - min) + min;
// const setOf = (c, C) => { var a = [], i = 0; while (i < c) { a.push(C(i++)) } return a };
// const eachOf = (a, C) => { var i = 0; const l = a.length; while (i < l && C(a[i], i++, l) !== true); return i };
// const mod = (v, m) => ((v % m) + m) % m;

// // create 100 particles
// const particles = setOf(100,() => {
//     return {
//       x : rand(innerWidth),
//       y : rand(innerHeight),
//       scale : rand(0.15, 0.5),
//       rot : rand(Math.PI * 2),
//       frame : 0,
//       frameRate : rand(-2,2),
//       dr : rand(-0.1,0.1),
//       dx : rand(-4,4),
//       dy : rand(-4,4),
//    };
// });
// // Animate and draw 100 particles
// function drawParticles(){
//   eachOf(particles, part => {
//      part.x += part.dx;
//      part.y += part.dy;
//      part.rot += part.dr;
//      part.frame += part.frameRate;
//      part.x = mod(part.x,innerWidth);
//      part.y = mod(part.y,innerHeight);
//      var frame = mod(part.frame ,myGif.frames.length) | 0;

//      drawImage(myGif.frames[frame].image,part.x,part.y,part.scale,part.rot);
//   });
// }      


var w = canvas.width;
var h = canvas.height;
var cw = w / 2; // center 
var ch = h / 2;

// // main update function
// function update(timer) {
//     ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
//     if (w !== innerWidth || h !== innerHeight) {
//         cw = (w = canvas.width = innerWidth) / 2;
//         ch = (h = canvas.height = innerHeight) / 2;
//     } else {
//         ctx.clearRect(0, 0, w, h);
//     }
//     if (myGif) { // If gif object defined
//         if (!myGif.loading) {  // if loaded
//             // draw random access to gif frames
//             drawParticles();
//             drawImage(myGif.image, cw, ch, 1, 0); // displays the current frame.
//         } else if (myGif.lastFrame !== null) {  // Shows frames as they load
//             ctx.drawImage(myGif.lastFrame.image, 0, 0);
//             ctx.fillStyle = "white";
//             ctx.fillText("GIF loading frame " + myGif.frames.length, 10, 21);
//             ctx.fillText("GIF loading frame " + myGif.frames.length, 10, 19);
//             ctx.fillText("GIF loading frame " + myGif.frames.length, 9, 20);
//             ctx.fillText("GIF loading frame " + myGif.frames.length, 11, 20);
//             ctx.fillStyle = "black";
//             ctx.fillText("GIF loading frame " + myGif.frames.length, 10, 20);

//         }

//     } else {
//         ctx.fillText("Waiting for GIF image ", 10, 20);

//     }
//     requestAnimationFrame(update);
// }
// requestAnimationFrame(update);


