
const socket = io();
var socketid;
portnum = 3000;

socket.on("connect", () => {
    console.log(`you connected with socket.id ${socket.id}`);
    socketid = socket.id;
})

var username = document.getElementById("username").innerText;
var pfpLink = document.getElementById("pfpLink").innerText;
var profilePic = document.getElementById("profilepic");

// let srcJPG = "../upload/" + username + "-" + "profilePic" + ".jpg"
// let srcGIF = "../upload/" + username + "-" + "profilePic" + ".gif"
// let srcPNG = "../upload/" + username + "-" + "profilePic" + ".png"

// if (imageExists(srcJPG)) {
//     profilePic.src = srcJPG;
// } else if (imageExists(srcPNG)) {
//     profilePic.src = srcPNG;
// } else if (imageExists(srcGIF)) {
//     profilePic.src = srcGIF;
// } else {
    // profilePic.src = "../images/profilepicother.png";
// }

profilePic.src = pfpLink;

function imageExists(image_url) {

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    try {
        http.send();
    } catch (error) {
        console.log("Img not found: " + image_url);
    }

    return http.status != 404;

}



// Show thee friends list
function showBlocked() {
    var tbl = document.getElementById("blockedTbl");
    var tblData = document.getElementById("blockedTblData");
    var tblDataJSON = JSON.parse(tblData.innerText);
    var tbody = document.createElement("tbody");
    if (tblDataJSON != null) {
        console.log("Blocked Table Data: ", tblDataJSON);
        tblDataJSON.forEach((item, index) => {
            console.log(`Tbl Obj: ${index}. ${item}`);
            var itemObjPrototype = document.getElementById("blockedTblItem");
            var itemObj = itemObjPrototype.cloneNode(true);
            let uname = itemObj.querySelector('#uname');
            let unblockbtn = itemObj.querySelector('#unblockBtn');
            unblockbtn.addEventListener("click", function (event) {
                blockUser(targetUser, "null", username)
            })
            let removebtn = itemObj.querySelector('#removeBtn');
            uname.innerText = item;
            itemObj.hidden = false;
            tbl.appendChild(itemObj);
        });
    } else {
        document.getElementById("noblocks").hidden = false;
    }
    tbl.appendChild(tbody);
    console.log("Done");
}

// JavaScript code
function searchBlocked() {
    let input = document.getElementById('searchbarBlocked').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('blocked');

    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display = "";
        }
    }
}

// JavaScript code
function searchFriends() {
    let input = document.getElementById('searchbarFriend').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('friend');

    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display = "";
        }
    }
}

// Show the list of friends
function showFriends() {
    var tbl = document.getElementById("friendTbl");
    var tblData = document.getElementById("friendTblData");
    var tblDataJSON = JSON.parse(tblData.innerText);
    var tbody = document.createElement("tbody");
    if (tblDataJSON != null) {
        console.log("Table Data: ", tblDataJSON);
        tblDataJSON.forEach((item, index) => {
            targetUser = item;
            console.log(`Tbl Obj: ${index}. ${targetUser}`);
            var itemObjPrototype = document.getElementById("friendTblItem")
            var itemObj = itemObjPrototype.cloneNode(true);
            let uname = itemObj.querySelector('#uname');
            uname.innerText = targetUser
            itemObj.hidden = false
            var giftBtn = itemObj.querySelector("#giftBtn");
            var removeFriendBtn = itemObj.querySelector("#removeFriendBtn");
            var sendMessageBtn = itemObj.querySelector("#sendMessageBtn");
            // sendMessageBtn.href = "/message:"+targetUser

            giftBtn.addEventListener("click", function (e) {
                tipUsers(username, targetUser, 10);
            })
            removeFriendBtn.addEventListener("click", function (e) {
                addFriend(username, targetUser, "remove");
            })
            sendMessageBtn.addEventListener("click", function (e) {
                location.href = "/message:" + targetUser;
            })
            tbl.appendChild(itemObj);
        });
    } else {
        document.getElementById("loser").hidden = false;
    }
    tbl.appendChild(tbody);
    console.log("Done");
}

var roomsNumber = 0;

showRoomConfig();
//Shows the saved room settings for making a new room
function showRoomConfig() {
    var tbl = document.getElementById("roomCfgTable");
    var tbody = document.getElementById("tbody");
    var tblData = document.getElementById("roomCfgTblData");
    var tblDataJSON = JSON.parse(tblData.innerText);

    console.log("Table Data: ", tblDataJSON);
    // var roomCfgTd1 = tbl.querySelector("#rmCfgTb1");
    // var roomCfgTd2 = tbl.querySelector("#rmCfgTb2");
    // var roomCfgTd3 = tbl.querySelector("#rmCfgTb3");
    // var roomCfgTd4 = tbl.querySelector("#rmCfgTb4");
    // var roomCfgTd5 = tbl.querySelector("#rmCfgTb5");
    // var roomCfgTd6 = tbl.querySelector("#rmCfgTb6");
    // var roomCfgTd7 = tbl.querySelector("#rmCfgTb7");

    // tblDataJSON.forEach((item, index) => {
    var roomCfg = tbl.querySelector("#tbody").querySelector("#rmCfg");

    // console.log(`Tbl Obj: ${index}. ${item}`);
    var newRoomCfg = roomCfg.cloneNode(true);
    newRoomCfg.hidden = false
    var roomCfgTd0 = newRoomCfg.querySelector("#rmCfgTb0");
    roomsNumber++;
    roomCfgTd0.innerText = roomsNumber + ". ";
    var roomCfgTd1 = newRoomCfg.querySelector("#rmCfgTb1");
    roomCfgTd1.innerText = tblDataJSON["topic"];
    var roomCfgTd2 = newRoomCfg.querySelector("#rmCfgTb2");
    roomCfgTd2.innerText = tblDataJSON["roomID"];
    var roomCfgTd3 = newRoomCfg.querySelector("#rmCfgTb3");
    roomCfgTd3.innerText = tblDataJSON["teams"];
    var roomCfgTd4 = newRoomCfg.querySelector("#rmCfgTb4");
    roomCfgTd4.innerText = tblDataJSON["tags"];
    var roomCfgTd5 = newRoomCfg.querySelector("#rmCfgTb5");
    roomCfgTd5.innerText = tblDataJSON["joinCost"];
    var roomCfgTd6 = newRoomCfg.querySelector("#rmCfgTb6");
    roomCfgTd6.innerText = tblDataJSON["private"];
    var roomCfgTd7 = newRoomCfg.querySelector("#rmCfgTb7");
    roomCfgTd7.innerText = tblDataJSON["passcode"];
    var roomCfgTd8 = newRoomCfg.querySelector("#rmCfgTb8");
    var joinBtn = roomCfgTd8.querySelector("#joinBtn");

    // joinBtn.addEventListen();
    var tbody = document.getElementById("tbody");
    tbody.append(newRoomCfg);
    // })

    // tblDataJSON.forEach((item, index) => {
    //     console.log(`Tbl Obj: ${index}. ${item}`);
    //     var tr = document.createElement("tr");
    //     var td = document.createElement("td");
    //     var tdBtn = document.createElement("td");

    //     var btn = document.createElement("button");
    //     btn.innerText = "Remove";
    //     btn.style = "padding-left: 2px; color: black;";
    //     td.innerText = item;
    //     tdBtn.appendChild(btn);
    //     tr.appendChild(td);
    //     tr.appendChild(tdBtn);
    //     tbody.appendChild(tr);
    // });
    tbl.appendChild(tbody);
    console.log("Done");
}

socket.on('tipEvent', (tipperUsername, msg_username, coinsAmount, roomid) => {
    if (roomid == room) {
        if (msg_username == username) {
            coins += coinsAmount;
            console.log("You have been tipped by ", tipperUsername);
        }
        if (tipperUsername == username) {
            coins -= coinsAmount;
            console.log("You just tipped ", msg_username);
        }
    }
})

// var submitImgBtn = document.getElementById("submitImageBtn");
// submitImgBtn.addEventListener("click", (e) => {
//     let imgFile = document.getElementById("imgFile");
//     if (imgFile.value == null) {

//     } else {
//         var payload = {
//             "username": username,
//             "image": imgFile
//         };
//         // e.preventDefault();
//         postData("http://localhost:" + portnum + "/upload", payload).then((data) => {
//             console.log(data);
//         });
//     }
// });

// function uploadPic() {

//     var payload = {
//         "username": username,
//         "image": document.getElementById("imgFile")
//     };

//     postData("http://localhost:" + portnum + "/upload", payload).then((data) => {
//         console.log(data);
//     });
// }


async function addFriend(currentUser, userToFollow, action) {
    // used to follow a user, add them to the friend list once
    var payload = {
        "currentUser": currentUser,
        "userToFollow": userToFollow,
        "action": action
    };
    postData("http://localhost:" + portnum + "/follow", payload).then((data) => {
        console.log(data);
    });
}

async function blockUser(userToBlock, roomId, currentUser) {
    // remove friend from follow list and hide thier messages from the chat
    var payload = {
        "userToBlock": userToBlock,
        "roomId": roomId,
        "currentUser": currentUser
    };
    postData("http://localhost:" + portnum + "/block", payload).then((data) => {
        //console.log(data);
    });
}


async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
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

console.log("Profile Page");
showFriends();
