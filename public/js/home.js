const socket = io();
var socketid;

socket.on("connect", () => {
    console.log(`you connected with socket.id ${socket.id}`);
    socketid = socket.id;
})

var roomListsText = document.getElementById("roomLists");
const rooms = JSON.parse(roomListsText.innerText);
var table = document.getElementById("activeRooms");
rows = table.rows;
var len = rows.length;

function listRooms() {

    console.log("Active Rooms: ", rooms);
    rooms.forEach(createtableDiv);


    // add a copy of drpdwnOption to the dropdown list
    function createtableDiv(item, index) {
        // create dropdown list option object
        var topic = rooms[index]["topic"];
        var watchCost = rooms[index]["watchCost"];
        var userslist = rooms[index]["users"];
        var age = rooms[index]["createDate"];
        // var username = rooms[index]["username"];


        var usersArray;
        try {
            usersArray = JSON.parse(userslist);
        } catch (error) {
            usersArray = userslist.split(",");
        }

        // duplicate template object from home.html
        var itemObjPrototype = document.getElementById("rm#row");
        var itemObj = itemObjPrototype.cloneNode(true);

        let rmNum = itemObj.querySelector('#rmNum');
        let rmTopic = itemObj.querySelector('#rmTopic');
        let rmNumofUsers = itemObj.querySelector('#rmNumofUsers');
        let rmCost = itemObj.querySelector('#rmCost');
        let rmAge = itemObj.querySelector('#rmAge');
        let rmTimeSeconds = itemObj.querySelector('#rmTimeSeconds');

        let rmJoin = itemObj.querySelector('#rmJoin');
        let rmCreate = itemObj.querySelector("#rmCreate");
        let rmTopicVal = itemObj.querySelector('#rmTopicVal');
        let rmUser = itemObj.querySelector("#rmUser");
        let rmRoomID = itemObj.querySelector('#rmRoomID');

        rmJoin.value = 1;
        rmCreate.value = 0;
        rmTopicVal.value = topic;
        rmUser.value = document.getElementById("userID").innerText;
        rmRoomID.value = rooms[index]["roomID"];


        rmNum.innerText = index + ".";
        rmTopic.innerText = topic;


        rmNumofUsers.innerText = usersArray.length;

        rmCost.innerText = watchCost;
        rmAge.innerText = age;

        itemObj.hidden = false;

        var age = rooms[index]["createDate"];

        // "2022-06-21T04:38:34.000Z".replace("T", "")
        age = age.replace("T", " ");
        age = age.replace(".000Z", "");
        // console.log("age of: " + roomId + " : " + age);
        // Split timestamp into [ Y, M, D, h, m, s ]

        // var t = "2010-06-09 13:12:01".split(/[- :]/);
        var t = age.split(/[- :]/);

        // Apply each element to the Date function
        var creationDate = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));

        const todaysdate = new Date();

        var startDate = creationDate;

        // Do your operations
        var endDate = todaysdate;

        //time in seconds from now to creationDate
        var time = (endDate - startDate) / 1000;
        rmTimeSeconds.innerText = time;

        var x = itemObj.querySelector("#rmAge");

        var seconds = Math.floor((endDate - startDate) / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        seconds = seconds % 60;
        hours = hours % 24;
        minutes = minutes % 60;

        if (days == 0 && hours > 0)
            age = hours + "h " + minutes + "m " + seconds + "s"
        if (hours == 0 && days == 0)
            age = minutes + "m " + seconds + "s"
        if (hours == 0 && minutes == 0 && days == 0)
            age = seconds + "s"
        if (days > 0 && hours == 0)
            age = days + "d " + minutes + "m "
        if (days > 0 && hours > 0)
            age = days + "d " + hours + "h "

        x.innerText = age;

        table.appendChild(itemObj);

    }

}

listRooms();

// JavaScript code
function searchRooms() {
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('rooms');

    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display = "";
        }
    }
}


function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    //  the table of rooms
    table = document.getElementById("activeRooms");
    // Filter dropdown list
    search = document.getElementById("selector").value;
    //for the while loop
    switching = true;

    var select = 0;

    if (search == "Age") select = 4;

    if (search == "Users") select = 2;

    if (search == "Alphabetical") select = 1;

    if (search == "Cost") select = 3;

    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;

        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[select];
            y = rows[i + 1].getElementsByTagName("TD")[select];
            // x = rows[i].querySelector("#rmTimeSeconds")


            //check if the two rows should switch place:
            if (document.getElementById("order").innerText == "ASC") {
                console.log("elem: " + x)
                if (select == 4) {
                    if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                        shouldSwitch = true;

                        break;
                    }
                } else if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (document.getElementById("order").innerText == "DSC") {
                if (select == 4) {
                    if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }

        // if (select == 4) {
        //     for (i = 0; i <= (rows.length - 1); i++) {

        //         var age = rooms[i]["createDate"];
        //         var roomId = rooms[i]["roomID"];

        //         // "2022-06-21T04:38:34.000Z".replace("T", "")
        //         age = age.replace("T", " ");
        //         age = age.replace(".000Z", "");
        //         // console.log("age of: "  + roomId + " : " + age);
        //         // Split timestamp into [ Y, M, D, h, m, s ]

        //         // var t = "2010-06-09 13:12:01".split(/[- :]/);
        //         var t = age.split(/[- :]/);

        //         // Apply each element to the Date function
        //         var creationDate = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));

        //         const todaysdate = new Date();

        //         var startDate = creationDate;
        //         // Do your operations
        //         var endDate = todaysdate;
        //         // var time = (endDate - startDate) / 1000;

        //         // age = time;


        //         var x = rows[i].getElementsByTagName("TD")[select];
        //         // var seconds = parseInt(x.innerHTML); //
        //         var seconds = Math.floor((endDate - startDate) / 1000);
        //         var minutes = Math.floor(seconds / 60);
        //         var hours = Math.floor(minutes / 60);
        //         var days = Math.floor(hours / 24);
        //         seconds = seconds % 60;
        //         hours = hours % 60;
        //         minutes = minutes % 60;
        //         // var age;

        //         if (days == 0 && hours > 0)
        //             age = hours + "h " + minutes + "m " + seconds + "s"
        //         if (hours == 0 && days == 0)
        //             age = minutes + "m " + seconds + "s"
        //         if (hours == 0 && minutes == 0)
        //             age = seconds + "s"
        //         else
        //             age = days + "d " + hours + "h " + minutes + "m " + seconds + "s"

        //         x.innerText = age;
        //     }
        // }

        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
