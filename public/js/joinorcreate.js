// const { delay } = require("bluebird");

async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

var portnum = 3000;

// const homeSocket = io();
var socketid;

// homeSocket.on("connect", () => {
//     console.log(`you connected with socket.id ${homeSocket.id}`);
//     socketid = homeSocket.id;

// })

function createRoom() {
    // used to follow a user, add them to the friend list once
    let topic, roomID, joinCost, watchCost, private, passcode, tags, teams, saveRmCfg, time;
    topic = document.getElementById("topic").value;
    roomID = document.getElementById("roomID").value;
    joinCost = document.getElementById("joincost").value;
    watchCost = document.getElementById("watchcost").value;
    private = document.getElementById("privateBox").value;
    teams = document.getElementById("teamsInput").value;
    tags = document.getElementById("tagsInput").value;
    passcode = document.getElementById("passcode").value;
    saveRmCfg = document.getElementById("saveConfigBox").value;
    time = document.getElementById("roomTime").value;
    let host = document.getElementById("host").value;
    let randNum = Math.floor(Math.random() * 100);

    if (!isNaN(time)) {
        time = 600;
    } if (!isNaN(watchCost)) {
        watchCost = 1;
    } if (!isNaN(joinCost)) {
        joinCost = 5;
    }if (teams.split(",").length == 1) {
        teams = ["Team 1", "Team 2"];
    }

    var payload = {
        "topic": topic,
        "roomID": roomID,
        "passcode": passcode,
        "joinCost": joinCost,
        "watchCost": watchCost,
        "teams": teams.split(","),
        "tags": tags.split(","),
        "private": private,
        "saveRmCfg": saveRmCfg,
        "host": host,
        "randNum": randNum,
        "time": time
    };

    // homeSocket.emit('createRoomHome', payload);

    socket.emit('createRoomHome', payload);
    // postData("http://localhost:" + portnum + "/createRoom", payload)
    delay(1000).then(() => {
        console.log("redirecting...");
        // postData("http://localhost:" + portnum + "/modal", payload);
        window.location.href = "/createRoom?data=" + randNum;
    });
}

// socket.on("goToRoom", (data) => {
//     data
// })

async function joinRoom() {
    // used to follow a user, add them to the friend list once
    let roomID, passcode, userID;

    roomID = document.getElementById("joinroom#").value;
    passcode = document.getElementById("password").value;
    userID = document.getElementById("host").value;
    let randNum = Math.floor(Math.random() * 100);
    var payload = {
        "roomID": roomID,
        "passcode": passcode,
        "userID": userID,
        "randNum": randNum
    };

    socket.emit("joinRoomHome", payload)

    delay(1000).then(() => {
        console.log("redirecting...");
        // postData("http://localhost:" + portnum + "/modal", payload);
        window.location.href = "/joinRoom?data=" + randNum;
        // window.location.href = "/joinRoom";
    });

}

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, rtopicad, force-cache, only-if-cached
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
    window.location.href = "/joinRoom";
    // return response.json(); // parses JSON response into native JavaScript objects
}
