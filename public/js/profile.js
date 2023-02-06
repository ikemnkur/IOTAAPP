
const socket = io();
var socketid;

socket.on("connect", () => {
    console.log(`you connected with socket.id ${socket.id}`);
    socketid = socket.id;
})


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
            console.log(`Tbl Obj: ${index}. ${item}`);
            var itemObjPrototype = document.getElementById("friendTblItem")
            var itemObj = itemObjPrototype.cloneNode(true);
            let uname = itemObj.querySelector('#uname');
            uname.innerText = item;
            itemObj.hidden = false
            tbl.appendChild(itemObj);
        });
    } else {
        document.getElementById("loser").hidden = false;
    }
    tbl.appendChild(tbody);
    console.log("Done");
}

//Shows the saved room settings for making a new room
function showRoomConfig() {
    var tbl = document.getElementById("roomCfgTable");
    var tblData = document.getElementById("roomCfgTblData");
    var tblDataJSON = JSON.parse(tblData.innerText);

    console.log("Table Data: ", tblDataJSON);

    var roomCfg = tbl.querySelector("#rmCfg");
    var roomCfgTd1 = tbl.querySelector("#rmCfgTb1");
    var roomCfgTd2 = tbl.querySelector("#rmCfgTb2");
    var roomCfgTd3 = tbl.querySelector("#rmCfgTb3");
    var roomCfgTd4 = tbl.querySelector("#rmCfgTb4");
    var roomCfgTd5 = tbl.querySelector("#rmCfgTb5");
    var roomCfgTd6 = tbl.querySelector("#rmCfgTb6");
    var roomCfgTd7 = tbl.querySelector("#rmCfgTb7");

    tblDataJSON.forEach((item, index) => {
        console.log(`Tbl Obj: ${index}. ${item}`);
        var newRoomCfg = roomCfg.cloneNode(true);
        tbl.append(newRoomCfg);
    })

    tblDataJSON.forEach((item, index) => {
        console.log(`Tbl Obj: ${index}. ${item}`);
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var tdBtn = document.createElement("td");

        var btn = document.createElement("button");
        btn.innerText = "Remove";
        btn.style = "padding-left: 2px; color: black;";
        td.innerText = item;
        tdBtn.appendChild(btn);
        tr.appendChild(td);
        tr.appendChild(tdBtn);
        tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    console.log("Done");
}

console.log("Profile Page");
showFriends();
