
var username = document.getElementById('username').innerText;
var chatToUser = null;

var messageData = document.getElementById('messageData').innerText;
let msg = JSON.parse(messageData);

var followerData = document.getElementById('followers').innerText;
let followerLists = JSON.parse(followerData);
let followers = JSON.parse(followerLists[0].followers);

var pfpsData = document.getElementById('pfps').innerText;
let pfpsLinks = JSON.parse(pfpsData);

var portnum = 3000;

var friendData = document.getElementById('friends').innerText;
var friendLists = JSON.parse(friendData);
let friends = JSON.parse(friendLists[0].friends);
console.log(friends);

var usersData = document.getElementById('listOfUsers').innerText;
let users = JSON.parse(usersData);
console.log(users[1].username);

var searchModeText = document.getElementById('searchMode');
var chatItem = document.getElementById('chatListItem');
var chatList = document.getElementById('chatList');

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

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


function setProfilePic2(profilePic, username) {

    for (var i = 0; i < pfpsLinks.length; i++) {
        console.log("PFP: ", pfpsLinks[i].profilePic)
        if (pfpsLinks[i].profilePic.includes(username)) {
            profilePic.src = pfpsLinks[i].profilePic;
        }
    }

    profilePic.style = "width: 32px; height: 32px;";
}

function setProfilePic(profilePic, username) {
    setTimeout(() => {
        // var image = document.createElement('img');
        let srcJPG = "../upload/" + "-" + username + "-" + "profilePic" + ".jpg"
        let srcGIF = "../upload/" + "-" + username + "-" + "profilePic" + ".gif"
        let srcPNG = "../upload/" + "-" + username + "-" + "profilePic" + ".png"

        if (imageExists(srcJPG)) {
            profilePic.src = srcJPG;
        } else if (imageExists(srcPNG)) {
            profilePic.src = srcPNG;
        } else if (imageExists(srcGIF)) {
            profilePic.src = srcGIF;
        } else {
            profilePic.src = "../images/profilepicother.png";
        }


        // //profilePic.src = "../upload/" + username + "-" + "profilePic" + ".png";
        // setTimeout(() => {
        //     if (profilePic.width == 16)
        //         profilePic.src = "../upload/" + username + "-" + "profilePic" + ".jpg";
        //     setTimeout(() => {
        //         if (profilePic.width == 16)
        //             profilePic.src = "../upload/" + username + "-" + "profilePic" + ".gif";
        //         setTimeout(() => {
        //             if (profilePic.width == 16){
        //                 console.log("Failed to load profile pic"); 
        //                 profilePic.src = "../images/profilepicother.png";
        //             }
        //         }, 25)
        //     }, 25)
        // }, 25)
    }, 25)
    profilePic.style = "width: 32px; height: 32px;";
}


var userBaseTab = document.getElementById('userBaseTab')
userBaseTab.addEventListener('click', function (e) {
    removeAllChildNodes(chatList);
    //change the color of the tabs
    userBaseTab.style.background = "grey";
    followersTab.style.background = "lightgrey";
    friendsTab.style.background = "lightgrey";
    //change the title of the header
    searchModeText.innerText = "Users Base Chats";
    // users.forEach((index, item) => {
    for (let i = 0; i < users.length; i++) {
        let newChatItem = chatItem.cloneNode(true);
        newChatItem.hidden = false;
        newChatItem.querySelector("#msgText").hidden = true;
        let pfp = newChatItem.querySelector("#profilePic"); ///.src = users[i].username + "-profilePic" + ".png";
        setProfilePic(pfp, users[i].username)
        newChatItem.querySelector("#msgTime").hidden = false;
        newChatItem.querySelector("#msgUsername").innerText = users[i].username;
        newChatItem.addEventListener('click', function (e) {
            //clear out the background color for all the list items
            let others = document.getElementsByClassName("otherChatItem");
            chatToUser = users[i].username;
            for (let i = 0; i < others.length; i++) {
                others[i].style.background = "white";
            }

            //toggle the background color for the clicked item
            if (newChatItem.style.background == "lightblue") {
                newChatItem.style.background = "white";
            } else {
                newChatItem.style.background = "lightblue";
            }
            // update the chatArea with relevant chat and draw chatboxes from the selected user
            loadChats(users[i].username)
        })
        chatList.appendChild(newChatItem);
    }
    //)
})


var friendsTab = document.getElementById('friendsTab')
friendsTab.addEventListener('click', function (e) {
    removeAllChildNodes(chatList);
    //change the color of the tabs
    userBaseTab.style.background = "lightgrey";
    followersTab.style.background = "lightgrey";
    friendsTab.style.background = "grey";
    //change the title of the header
    searchModeText.innerText = "Friend Chats";

    if (friendLists.length == 0) {// if the user has noo friends then show the error msg
        let newChatItem = chatItem.cloneNode(true);
        newChatItem.hidden = false;
        newChatItem.querySelector("#msgText").hidden = false;
        newChatItem.querySelector("#msgText").innerText = "You have no friends";
        newChatItem.querySelector("#profilePic").hidden = true;
        newChatItem.querySelector("#msgTime").hidden = true;
        newChatItem.querySelector("#msgUsername").hidden = true;
        chatList.appendChild(newChatItem);
    }
    for (let i = 0; i < friends.length; i++) {
        let newChatItem = chatItem.cloneNode(true);
        newChatItem.hidden = false;
        newChatItem.querySelector("#msgText").hidden = true;
        let pfp = newChatItem.querySelector("#profilePic"); ///.src = friendss[i].friendsname + "-profilePic" + ".png";
        setProfilePic(pfp, friends[i])
        newChatItem.querySelector("#msgTime").hidden = false;
        newChatItem.querySelector("#msgUsername").innerText = friends[i];
        newChatItem.addEventListener('click', function (e) {
            //clear out the background color for all the list items
            let others = document.getElementsByClassName("otherChatItem");
            chatToUser = friends[i];
            for (let i = 0; i < others.length; i++) {
                others[i].style.background = "white";
            }

            //toggle the background color for the clicked item
            if (newChatItem.style.background == "lightblue") {
                newChatItem.style.background = "white";
            } else {
                newChatItem.style.background = "lightblue";
            }
            // update the chatArea with relevant chat and draw chatboxes from the selected friends
            loadChats(friends[i])
        })
        chatList.appendChild(newChatItem);
    }
    //)
})

var followersTab = document.getElementById('followersTab')
followersTab.addEventListener('click', function (e) {
    removeAllChildNodes(chatList);
    //change the color of the tabs
    userBaseTab.style.background = "lightgrey";
    followersTab.style.background = "grey";
    friendsTab.style.background = "lightgrey";
    //change the title of the header
    searchModeText.innerText = "Followers Chats";
    if (followers.length == 0) {
        let newChatItem = chatItem.cloneNode(true);
        newChatItem.hidden = false;
        newChatItem.querySelector("#msgText").hidden = false;
        newChatItem.querySelector("#msgText").innerText = "You have no followers";
        newChatItem.querySelector("#profilePic").hidden = true;
        newChatItem.querySelector("#msgTime").hidden = true;
        newChatItem.querySelector("#msgUsername").hidden = true;
        chatList.appendChild(newChatItem);
    } else {
        for (let i = 0; i < followers.length; i++) {
            let newChatItem = chatItem.cloneNode(true);
            newChatItem.hidden = false;
            newChatItem.querySelector("#msgText").hidden = true;
            let pfp = newChatItem.querySelector("#profilePic");
            setProfilePic(pfp, followers[i])
            newChatItem.querySelector("#msgTime").hidden = false;
            newChatItem.querySelector("#msgUsername").innerText = followers[i];
            newChatItem.addEventListener('click', function (e) {
                //clear out the background color for all the list items
                let others = document.getElementsByClassName("otherChatItem");
                chatToUser = followers[i];
                for (let i = 0; i < others.length; i++) {
                    others[i].style.background = "white";
                }

                //toggle the background color for the clicked item
                if (newChatItem.style.background == "lightblue") {
                    newChatItem.style.background = "white";
                } else {
                    newChatItem.style.background = "lightblue";
                }
                // update the chatArea with relevant chat and draw chatboxes from the selected followers
                loadChats(followers[i])
            })
            chatList.appendChild(newChatItem);
        }
    }

    //)
})

// var followersTab = document.getElementById('followersTab')
// followersTab.addEventListener('click', function (e) {
//     userBaseTab.style.background = "lightgrey";
//     followersTab.style.background = "grey";
//     friendsTab.style.background = "lightgrey";
//     searchModeText.innerText = "Follower Chats";
//     followers.forEach((index, item) => {
//         let newChatItem = chatItem.cloneNode(true);
//         newChatItem.hidden = false;
//         newChatItem.querySelector("#msgUsername").innerText = followers[index].username;
//         newChatItem.addEventListener('click', function (e) {
//             let others = document.getElementsByClassName("otherChatItem");
//             for (let i = 0; i < others.length; i++) {
//                 others[i].style.background = "white";
//             }
//             if (newChatItem.style.background == "lightblue") {
//                 newChatItem.style.background = "white";
//             } else {
//                 newChatItem.style.background = "lightblue";
//             }
//         })
//         chatList.appendChild(newChatItem);
//     });
// })

// JavaScript code
function searchTabs() {
    let input = document.getElementById('lookupUser').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('otherChatItem');

    for (i = 0; i < x.length; i++) {
        if (!x[i].querySelector("#msgUsername").innerText.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display = "";
        }
    }
}

var chatArea = document.getElementById('chatArea');
var testMessageData = document.getElementById('testMessageData').innerText;
var chatWith = document.getElementById('chattingWithUser');
// var TMD = JSON.parse(testMessageData);
var TMD;

let testData = JSON.parse(document.getElementById('testMessageData').innerText);
let xyz = [{
    "msgId": "1234",
    "from": "admin",
    "to": "person",
    "date": ["12: 30", "11 / 8 / 2019"],
    "Text": "Bye Alphabetical leters",
    "data": ["heart", "happy", "proud"]
},
{
    "msgId": "456",
    "from": "admin",
    "to": "person",
    "date": ["12: 40", "11 / 9 / 2019"],
    "Text": "Happy as can be",
    "data": ["heart", "happy", "proud"]
},
{
    "msgId": "456",
    "from": "admin",
    "to": "person",
    "date": ["12: 40", "11 / 9 / 2019"],
    "Text": "hello Alphabetical leters",
    "data": ["heart", "happy", "proud"]
},
{
    "msgId": "456",
    "from": "person",
    "to": "admin",
    "date": ["12: 40", "11 / 10 / 2019"],
    "Text": "hello dfhtrjnsr leters",
    "data": ["heart", "happy", "proud"]
},
{
    "msgId": "456",
    "from": "person",
    "to": "person",
    "date": ["12: 40", "11 / 19 / 2019"],
    "Text": "are you doing something cool today",
    "data": ["heart", "happy", "proud"]
},
{
    "msgId": "123",
    "from": "person",
    "to": "admin",
    "date": ["08: 30", "11 / 20 / 2019"],
    "Text": "Yes im getting bread and stacking paper",
    "data": ["heart", "happy", "proud"]
}]

function loadChats(otherChatUser) {

    chatWith.innerText = "Chatting with " + otherChatUser;

    var yourChatBox = document.getElementById('youChatBox');
    var otherChatBox = document.getElementById('otherChatBox');
    var day = document.getElementById('day');

    //clear the chatArea's old chats
    let element = document.getElementById("chatArea");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    testData.forEach((item, index) => {
        let TMD = item;
        // if the other user selected in the chat userlist area is in the messageData then create a chat box in the chat area
        if (otherChatUser == testData[index]["from"] || otherChatUser == testData[index]["to"]) {
            // add a date stamp if the message date changes
            if (TMD["from"] == username || TMD["to"] == username) {
                if (index > 0) {
                    //If the message date changes
                    if (testData[index - 1]["date"][1] != testData[index]["date"][1]) {
                        let dayStamp = day.cloneNode(true);
                        dayStamp.innerText = testData[index]["date"][1];
                        dayStamp.hidden = false;
                        chatArea.append(dayStamp)
                    }
                } else {
                    let dayStamp = day.cloneNode(true);
                    dayStamp.innerText = testData[index]["date"][1];
                    dayStamp.hidden = false;
                    chatArea.append(dayStamp)
                }
            }
            if (TMD["from"] == username) {
                let yourChat = yourChatBox.cloneNode(true);
                yourChat.querySelector("#msg").innerText = TMD["Text"];
                yourChat.querySelector("#createDate").innerText = TMD["date"][0];
                yourChat.hidden = false;

                var username = document.getElementById("username").innerText;
                var profilePic = yourChat.querySelector("profilepic");

                setProfilePic(profilePic, username)

                chatArea.appendChild(yourChat);
            }
            if (TMD["to"] == username) {
                let otherChat = otherChatBox.cloneNode(true);
                otherChat.querySelector("#msg").innerText = TMD["Text"];
                otherChat.querySelector.innerText = TMD["date"][0];
                otherChat.hidden = false;

                var username = document.getElementById("username").innerText;

                var profilePic = otherChat.querySelector("profilepic");
                setProfilePic(profilePic, username)

                // setTimeout(() => {
                //     profilePic.src = "../upload/" + TMD["from"] + "-" + "profilePic" + ".png";
                //     setTimeout(() => {
                //         if (profilePic.width == 16)
                //             profilePic.src = "../upload/" + TMD["from"] + "-" + "profilePic" + ".jpg";
                //         setTimeout(() => {
                //             if (profilePic.width == 16)
                //                 profilePic.src = "../upload/" + TMD["from"] + "-" + "profilePic" + ".gif";
                //             setTimeout(() => {
                //                 if (profilePic.width == 16)
                //                     profilePic.src = "../images/profilepicother.png";
                //             }, 25)
                //         }, 25)
                //     }, 25)
                // }, 25)

                chatArea.appendChild(otherChat);
            }
            // console.log("Msg: " + item["Text"]);
        }

    });
}

var yourChatBox = document.getElementById('youChatBox');
var otherChatBox = document.getElementById('otherChatBox');
var day = document.getElementById('day');

//clear the chatArea's old chats
let element = document.getElementById("chatArea");
while (element.firstChild) {
    element.removeChild(element.firstChild);
}

testData.forEach((item, index) => {
    let TMD = item;
    // add a date stamp if the message date changes
    if (TMD["from"] == username || TMD["to"] == username) {
        if (index > 0) {
            //If the message date changes
            if (testData[index - 1]["date"][1] != testData[index]["date"][1]) {
                let dayStamp = day.cloneNode(true);
                dayStamp.innerText = testData[index]["date"][1];
                dayStamp.hidden = false;
                chatArea.append(dayStamp)
            }
        } else {
            let dayStamp = day.cloneNode(true);
            dayStamp.innerText = testData[index]["date"][1];
            dayStamp.hidden = false;
            chatArea.append(dayStamp)
        }
    }

    if (TMD["from"] == username) {
        let yourChat = yourChatBox.cloneNode(true);
        yourChat.querySelector("#msg").innerText = TMD["Text"];
        yourChat.querySelector("#createDate").innerText = TMD["date"][0];
        yourChat.hidden = false;
        chatArea.appendChild(yourChat);
    }
    if (TMD["to"] == username) {
        let otherChat = otherChatBox.cloneNode(true);
        otherChat.querySelector("#msg").innerText = TMD["Text"];
        otherChat.querySelector("#createDate").innerText = TMD["date"][0];
        otherChat.hidden = false;
        chatArea.appendChild(otherChat);
    }
    // console.log("Msg: " + item["Text"]);

});

let enterMessage = document.getElementById("enterMsg");
let sendMsg = document.getElementById("sendMsgBtn");

sendMsg.addEventListener("click", function (e) {
    e.preventDefault();
    if (chatToUser != null)
        sendMessage(chatToUser, username, enterMessage.value);
})

async function sendMessage(toUser, fromUser, text) {
    // remove friend from follow list and hide thier messages from the chat
    const d = new Date();
    var payload = {
        "touser": toUser,
        "fromuser": fromUser,
        "msg": {
            "msgId": fromUser + "#" + `${d.getHours()}:${d.getMinutes()} ` + "#" + `${d.getMonth()} / ${d.getDay()} / ${d.getFullYear()}` + "#" + toUser,
            "from": fromUser,
            "to": toUser,
            "date": [`${d.getHours()}:${d.getMinutes()} `, `${d.getMonth()} / ${d.getDay()} / ${d.getFullYear()}`],
            "Text": text,
            "data": ["heart", "happy", "proud"]
        }
    };
    postData("http://localhost:" + portnum + "/sendMessage", payload).then((data) => {
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



