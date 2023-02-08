
var username = document.getElementById('username').innerText;
var chatToUser = null;
var messageData = document.getElementById('messageData').innerText;
let msg = JSON.parse(messageData);

var followerData = document.getElementById('followers').innerText;
let followers = JSON.parse(followerData);


var friendData = document.getElementById('friends').innerText;
// friendData.replace('\',)
let friends = JSON.parse(friendData);
console.log(friends);

var usersData = document.getElementById('listOfUsers').innerText;
let users = JSON.parse(usersData);
console.log(users[1].username);

var searchModeText = document.getElementById('searchMode');
var chatItem = document.getElementById('chatListItem');
var chatList = document.getElementById('chatList');

var userBaseTab = document.getElementById('userBaseTab')
userBaseTab.addEventListener('click', function (e) {
    userBaseTab.style.background = "grey";
    followersTab.style.background = "lightgrey";
    friendsTab.style.background = "lightgrey";
    searchModeText.innerText = "Users Base Chats";
    // users.forEach((index, item) => {
    for (let i = 0; i < users.length; i++) {
        let newChatItem = chatItem.cloneNode(true);
        newChatItem.hidden = false;
        newChatItem.querySelector("#msgText").hidden = true;
        newChatItem.querySelector("#msgTime").hidden = true;
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
    userBaseTab.style.background = "lightgrey";
    followersTab.style.background = "lightgrey";
    friendsTab.style.background = "grey";
    searchModeText.innerText = "Friend Chats";
    friends.forEach((index, item) => {
        let newChatItem = chatItem.cloneNode(true);
        newChatItem.hidden = false;
        newChatItem.querySelector("#msgUsername").innerText = users[index].username;
        newChatItem.addEventListener('click', function (e) {
            let others = document.getElementsByClassName("otherChatItem");
            for (let i = 0; i < others.length; i++) {
                others[i].style.background = "white";
            }
            if (newChatItem.style.background == "lightblue") {
                newChatItem.style.background = "white";
            } else {
                newChatItem.style.background = "lightblue";
            }
        })
        chatList.appendChild(newChatItem);
    });
})

var followersTab = document.getElementById('followersTab')
followersTab.addEventListener('click', function (e) {
    userBaseTab.style.background = "lightgrey";
    followersTab.style.background = "grey";
    friendsTab.style.background = "lightgrey";
    searchModeText.innerText = "Follower Chats";
    followers.forEach((index, item) => {
        let newChatItem = chatItem.cloneNode(true);
        newChatItem.hidden = false;
        newChatItem.querySelector("#msgUsername").innerText = followers[index].username;
        newChatItem.addEventListener('click', function (e) {
            let others = document.getElementsByClassName("otherChatItem");
            for (let i = 0; i < others.length; i++) {
                others[i].style.background = "white";
            }
            if (newChatItem.style.background == "lightblue") {
                newChatItem.style.background = "white";
            } else {
                newChatItem.style.background = "lightblue";
            }
        })
        chatList.appendChild(newChatItem);
    });
})

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

            if (TMD["from"] == username) {
                let yourChat = yourChatBox.cloneNode(true);
                yourChat.querySelector("#msg").innerText = TMD["Text"];
                yourChat.querySelector("#createDate").innerText = TMD["date"][0];
                yourChat.hidden = false;
                chatArea.appendChild(yourChat);
            } else
                if (TMD["to"] == username) {
                    let otherChat = otherChatBox.cloneNode(true);
                    otherChat.querySelector("#msg").innerText = TMD["Text"];
                    otherChat.hidden = false;
                    chatArea.appendChild(otherChat);
                }
            console.log("Msg: " + item["Text"]);
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

    if (TMD["from"] == username) {
        let yourChat = yourChatBox.cloneNode(true);
        yourChat.querySelector("#msg").innerText = TMD["Text"];
        yourChat.querySelector("#createDate").innerText = TMD["date"][0];
        yourChat.hidden = false;
        chatArea.appendChild(yourChat);
    } else
        if (TMD["to"] == username) {
            let otherChat = otherChatBox.cloneNode(true);
            otherChat.querySelector("#msg").innerText = TMD["Text"];
            otherChat.hidden = false;
            chatArea.appendChild(otherChat);
        }
    console.log("Msg: " + item["Text"]);

});

let enterMessage = document.getElementById("enterMsg");
let sendMsg = document.getElementById("sendMsgBtn");

sendMsg.addEventListener("click", function (e) {
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
            "msgId": fromUser + `${d.getHours()}:${d.getMinutes()} ` + `${d.getMonth} / ${d.getDay} / ${d.getFullYear}` + toUser,
            "from": fromUser,
            "to": toUser,
            "date": [`${d.getHours()}:${d.getMinutes()} `, `${d.getMonth} / ${d.getDay} / ${d.getFullYear}`],
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



