var portnum = 3000;

function createRoom() {
    // used to follow a user, add them to the friend list once
    let topic, roomID, joinCost, watchCost, private, passcode, tags, teams, saveRmCfg;
    topic = document.getElementById("topic").value;
    roomID = document.getElementById("roomID").value;
    joinCost = document.getElementById("joincost").value;
    watchCost = document.getElementById("watchcost").value;
    private = document.getElementById("privateBox").value;
    teams = document.getElementById("teamsInput").value;
    tags = document.getElementById("tagsInput").value;
    passcode = document.getElementById("passcode").value;
    saveRmCfg = document.getElementById("saveConfigBox").value;
    let host = document.getElementById("host").value;
    
    var payload = {
        "topic": topic,
        "roomID": roomID,
        "passcode": passcode,
        "joinCost": joinCost,
        "watchCost": watchCost,
        "teams": teams,
        "tags": tags,
        "private": private,
        "saveRmCfg": saveRmCfg,
        "host": host,
    };

    postData("http://localhost:" + portnum + "/createRoom", payload)
}

async function joinRoom() {
    // used to follow a user, add them to the friend list once
    let roomID, passcode, userID;

    roomID = document.getElementById("joinroom#").value;
    passcode = document.getElementById("password").value;
    userID = document.getElementById("users").value;
    var payload = {
        "roomID": roomID,
        "passcode": passcode,
        "userID": userID
    };

    postData("http://localhost:" + portnum + "/joinRoom", payload)
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
    return response.json(); // parses JSON response into native JavaScript objects
}
