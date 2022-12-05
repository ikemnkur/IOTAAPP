function listRooms() {
    var count = 0;
    var table = document.getElementById("activeRooms");
    var roomListsText = document.getElementById("roomLists");
    var user = document.getElementById("userID").innerText;

    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(0);

    // Insert new cells (<td> elements) at the 1st, 2nd, 3rd, 4th, and 5th position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    // var cell7 = row.insertCell(6);
    // Add some text to the header cells:
    cell1.innerHTML = "#";
    cell2.innerHTML = "Topic";
    // cell3.innerHTML = "RoomID";
    
    cell3.innerHTML = "# of Users";
    cell4.innerHTML = "Watch Cost";
    cell5.innerHTML = "Join Cost"; 
    cell6.innerHTML = "Join Room";
    // cell7.innerHTML = "Join Room";

    const rooms = JSON.parse(roomListsText.innerText);
    console.log("Active Rooms: ", rooms);
    rooms.forEach(createtableDiv);

    // add a copy of drpdwnOption to the dropdown list
    function createtableDiv(item, index) {
        // create dropdown list option object
        topic = rooms[index]["topic"];
        roomId = rooms[index]["roomID"];
        watchCost = rooms[index]["watchCost"];
        joinCost = rooms[index]["joinCost"];
        userslist = rooms[index]["users"];
        
        try {
            usersArray = JSON.parse(userslist);
        } catch (error) {
            usersArray = userslist.split(",");
        }
        
        // console.log("Usernames Array: ", usersArray);
        numberOfUsers = usersArray.length;
        count++;

        const tableRow = document.createElement("tr");
        tableRow.className = "rooms";
        //Numbering index div
        const tableDivIndex = document.createElement("td");
        tableDivIndex.innerText = (count) + ". ";
        //Room Id div
        const tableDivRoomID = document.createElement("td");
        tableDivRoomID.innerText = roomId;
        //Topic div
        const tableDivTopic = document.createElement("td");
        tableDivTopic.innerText = topic; // Set list text
        //User number div
        const tableDivUsernNum = document.createElement("td");
        tableDivUsernNum.innerText = numberOfUsers;
        //Numbering index div
        const tableDivJoinCost = document.createElement("td");
        tableDivJoinCost.innerText = joinCost;
        //Numbering index div
        const tableDivWatchCost = document.createElement("td");
        tableDivWatchCost.innerText = watchCost;
        //hidden form to pass values to Node JS Query, appended to form
        const tableDivJoin = document.createElement("td");
        const tableDivFormBtn = document.createElement("form");
        const tableDivJoinRoomID = document.createElement("Input");
        const tableDivJoinTopic = document.createElement("Input");
        const tableDivJoinUser = document.createElement("Input");
        const tableDivJoinJoin = document.createElement("Input");
        const tableDivJoinCreate = document.createElement("Input");
        tableDivJoinJoin.value = 1; tableDivJoinJoin.name = "join"; tableDivJoinJoin.style.display = "none";
        tableDivJoinCreate.value = 0; tableDivJoinCreate.name = "create"; tableDivJoinCreate.style.display = "none";
        tableDivJoinRoomID.value = roomId; tableDivJoinRoomID.name = "roomID"; tableDivJoinRoomID.style.display = "none";
        tableDivJoinUser.value = user; tableDivJoinUser.name = "user"; tableDivJoinUser.style.display = "none";
        tableDivJoinTopic.value = topic; tableDivJoinTopic.name = "topic"; tableDivJoinTopic.style.display = "none";
        //join button
        const tableDivJoinButton = document.createElement("button");
        tableDivJoinButton.type = "submit";
        tableDivFormBtn.action = "/modal";
        tableDivFormBtn.method = "POST";
        tableDivJoinButton.innerText = "Join";
        tableDivJoinButton.value = "JoinRm";
        tableDivFormBtn.appendChild(tableDivJoinButton);
        // Append hidden form elements to the <form> elem.
        tableDivFormBtn.appendChild(tableDivJoinJoin); tableDivFormBtn.appendChild(tableDivJoinCreate); tableDivFormBtn.appendChild(tableDivJoinTopic);
        tableDivFormBtn.appendChild(tableDivJoinUser); tableDivFormBtn.appendChild(tableDivJoinRoomID);
        //Append <td> elem. to <tr>
        tableDivJoin.appendChild(tableDivFormBtn);// Append to join div:
        tableRow.appendChild(tableDivIndex);
        tableRow.appendChild(tableDivTopic);
        // tableRow.appendChild(tableDivRoomID);
        tableRow.appendChild(tableDivUsernNum);
        tableRow.appendChild(tableDivWatchCost);
        tableRow.appendChild(tableDivJoinCost);
        tableRow.appendChild(tableDivJoin);
        table.appendChild(tableRow);    // Append to table:
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
            //console.log("Remove Search Term: ", x[i].innerText)
        }
        else {
            x[i].style.display = "";
        }
    }
}


function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("activeRooms");
    search = document.getElementById("selector").value;
    switching = true;
    var select = 0;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        if (search == "Age") select = 0;
        if (search == "Users") select = 3;
        if (search == "Alphabetical") select = 1;
        if (search == "Cost") select = 5;


        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[select];
            y = rows[i + 1].getElementsByTagName("TD")[select];
            //check if the two rows should switch place:
            if (document.getElementById("order").innerText == "ASC") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (document.getElementById("order").innerText == "DSC") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
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
