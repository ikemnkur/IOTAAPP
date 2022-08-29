var modalJSONtext = document.getElementById("roomModalJSON");
const roomModalJSON = JSON.parse(modalJSONtext.innerText);

function roomModal() {

    // console.log("Room Modal JSON Obj: ", roomModalJSON);

    // var cost2join = document.getElementById("CtJ");
    // var cost2watch = document.getElementById("CtW");
    var numbOfUsers = document.getElementById("NoU");

    var activeUsersList = roomModalJSON[0]["users"];
    console.log("Modal Users: ", activeUsersList);
    //console.log("Modal Users info (parsed): ", JSON.parse(activeUsersList));
    //const activeUsersArray = activeUsersList.split(",");
    var activeUsersArray = JSON.parse(activeUsersList);
    var NoU = activeUsersArray.length;
    console.log("Number of Users: ", NoU);
    // console.log("Room Modal JSON(topic): ", roomModalJSON[0]["topic"]);
    //cost2join.innerHTML = roomModalJSON[0]["joinCost"];
    //cost2watch.innerText = roomModalJSON[0]["watchCost"];
    numbOfUsers.innerText = NoU;

}

roomModal();


var teams = roomModalJSON[0]["teams"];;

// const dropDownItems = teams.split(",");
const dropDownItems = JSON.parse(teams);

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
// getUserNum();