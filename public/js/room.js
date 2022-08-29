

function joinRoom() {
    const roomJSONtext = document.getElementById("roomJSON");
    const roomJSON = JSON.parse(roomJSONtext.innerText);
    console.log("room JSON obj: ", roomJSON);
}

// joinRoom();

function getUsers() {
    return roomJSON.users;
}

function getRoomID() {
    return roomJSON.roomID;
}

function getRoomTopic() {
    return roomJSON.topic;
}

// async function userLeaveRoom() {
//     const info = {
//         "roomID": roomJSON[0]["roomID"],
//         "user": roomJSON[0]["user"],
//     }

//     const res = await fetch("http://localhost:3020/userLeaveRoom", {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify(info),
//     });
    
// }