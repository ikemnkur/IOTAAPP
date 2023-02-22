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
        var roomtime = rooms[index]["time"];
        var host = rooms[index]["host"];


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
        let rmHost = itemObj.querySelector('#rmHost');
        let rmNumofUsers = itemObj.querySelector('#rmNumofUsers');
        let rmCost = itemObj.querySelector('#rmCost');
        let rmAge = itemObj.querySelector('#rmAge');
        let rmTime = itemObj.querySelector('#timeLeftText');
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
        rmHost.innerText = host;
        rmNumofUsers.innerText = usersArray.length;

        rmCost.innerText = watchCost;
        rmAge.innerText = age;
        // rmTime.innerText = roomtime;

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

        var roomAge = itemObj.querySelector("#rmAge");

        var seconds = Math.floor((endDate - startDate) / 1000);

        roomAge.innerText = convert2Timestamp(seconds);

        var timeleft = roomtime - seconds;
        if (timeleft < 0) 
            timeleft = 0;
        console.log("Timeleft: " + timeleft);

        rmTime.innerText = convert2Timestamp(timeleft)

        // if (timeleft > 0)
        table.appendChild(itemObj);

    }

}

function convert2Timestamp(seconds) {
    // var seconds = Math.floor((endDate - startDate) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    seconds = seconds % 60;
    hours = hours % 24;
    minutes = minutes % 60;

    if (days == 0 && hours > 0)
        time = hours + "h " + minutes + "m " + seconds + "s"
    if (hours == 0 && days == 0)
        time = minutes + "m " + seconds + "s"
    if (hours == 0 && minutes == 0 && days == 0)
        time = seconds + "s"
    if (days > 0 && hours == 0)
        time = days + "d " + minutes + "m "
    if (days > 0 && hours > 0)
        time = days + "d " + hours + "h "

    return time;
}

listRooms();

// JavaScript code
function searchRooms() {
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    let inputs;
    let mode;

    if (input.includes('&&')) {
        // mode =  search the search for the term after the "&&&" symbols
        inputs = input.split("&&");
        mode = "and";
    } else if (input.includes('++')) {
        // mode =  search for both of the term separated by the "+++" symbols
        inputs = input.split("++");
        mode = "or";
    } else {
        inputs = input;
    }


    let x = document.getElementsByClassName('rooms');
    // let loops = 0;
    try {
        inputs.forEach((item, index) => {
            // if (mode == null)
            // console.log("ST" + "(" + index + ")" + ":", item)
            if (index > 0) {
                // if there is more than 1 search term to look for do this
                // console.log("Nolde")
                for (i = 0; i < x.length; i++) {
                    if (!x[i].innerHTML.toLowerCase().includes(item)) {
                        if (x[i].style.display != "none")
                            x[i].style.display = "none";
                    }
                }
            } else {
                for (i = 0; i < x.length; i++) {

                    // For the 1st searchterm do this
                    if (!x[i].innerHTML.toLowerCase().includes(item)) {
                        x[i].style.display = "none";
                    }
                    else {
                        x[i].style.display = "";
                    }

                }
            }
        })
    } catch (error) {
        for (i = 0; i < x.length; i++) {
            // if there is more than 1 search term to look for do this

            if (!x[i].innerHTML.toLowerCase().includes(input)) {
                x[i].style.display = "none";
            }
            else {
                x[i].style.display = "";
            }
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

    if (search == "Users") select = 3;

    if (search == "Topic") select = 1;

    if (search == "Cost") select = 5;
    if (search == "Host") select = 2;
    if (search == "Time Left") select = 5;

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

        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
