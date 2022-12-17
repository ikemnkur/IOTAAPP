var roomJSONtext = document.getElementById("roomObj");
const roomModalJSON = JSON.parse(roomJSONtext.innerText);

function roomModal() {

    // var numbOfUsers = document.getElementById("NoU");
    // var activeUsersList = document.getElementById("NoU").innerText;
    // numbOfUsers.innerText = '';
    // console.log("Modal Users: ", activeUsersList);
    // var activeUsersArray = JSON.parse(activeUsersList);
    // var NoU = activeUsersArray.length;
    // console.log("Number of Users: ", NoU);
    // numbOfUsers.innerText = NoU;

    var numbOfUsers = document.getElementById("NoU");
    var activeUsersList = roomModalJSON[0]["users"];
    console.log("Modal Users: ", activeUsersList);
    try {
        var activeUsersArray = JSON.parse(activeUsersList);
    } catch (error) {
        var activeUsersArray = activeUsersList.split(",");
    }

    var NoU = activeUsersArray.length;
    console.log("Number of Users: ", NoU);
    numbOfUsers.innerText = NoU;

}

roomModal();

var teams = roomModalJSON[0]["teams"];
var dropDownItems;
try {
    dropDownItems = JSON.parse(teams);
} catch (error) {
    dropDownItems = teams.split(",");
}


var teamdrpdwn = document.getElementById('teamSelector');

// for each in the text array add to dropdown list
dropDownItems.forEach(createDrpDnwList);

// add a copy of drpdwnOption to the dropdown list
function createDrpDnwList(item, index) {
    // create dropdown list option object
    const drpdwnOption = document.createElement("option");
    drpdwnOption.innerText = (index + 1) + ": " + item; // Set dropdown text
    drpdwnOption.value = item;
    teamdrpdwn.appendChild(drpdwnOption);    // Append to body:
}

// Loads the Enter room modal at startup
function loadModal() {
    document.getElementById('id01').style.display = 'block';
}

loadModal();

async function sumbitFunc() {
    // submitModalData();

    document.getElementById('id01').style.display = 'none';
}

async function submitModalData() {
    // remove friend from follow list and hide thier messages from the chat
    var payload = {
        "team": document.getElementById('teamSelector').value,
        "nickname": document.getElementById('nickname').value,
        "secretMode": document.getElementById('secret').checked,
        "join": 1,
        "create": 0,
        "roomOBJ": (document.getElementById('roomObj').innerText),
        "userJSON": (document.getElementById('userJSON').innerText)
    };
    postData("http://localhost:3000/room", payload)//.then((data) => {
    //     console.log(data);
    //  });
    const myTimeout = setTimeout(redirectPage, 500);

    function myStopFunction() {
        clearTimeout(myTimeout);
    }
    function redirectPage() {
        // window.location = "../newRoom";
        myStopFunction();
    }

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
