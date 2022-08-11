var modalJSONtext = document.getElementById("roomModalJSON");
const roomModalJSON = JSON.parse(modalJSONtext.innerText);

function roomModal() {

    // console.log("Room Modal JSON Obj: ", roomModalJSON);

    // var cost2join = document.getElementById("CtJ");
    // var cost2watch = document.getElementById("CtW");
    var numbOfUsers = document.getElementById("NoU");

    var activeUsersList = roomModalJSON[0]["users"];
    const activeUsersArray = activeUsersList.split(",");
    var NoU = activeUsersArray.length;

    // console.log("Room Modal JSON(topic): ", roomModalJSON[0]["topic"]);
    //cost2join.innerHTML = roomModalJSON[0]["joinCost"];
    //cost2watch.innerText = roomModalJSON[0]["watchCost"];
    numbOfUsers.innerText = NoU;

}

roomModal();

var text = "abc, 123, xyz"
var teams = roomModalJSON[0]["teams"];;

const dropDownItems = teams.split(",");

var teamdrpdwn = document.getElementById('teams');

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

function getUserNum() {
    var text = document.getElementById('NoU').innerText;
    const userNum = text.split(",");
    var num = userNum.length;
    document.getElementById('NoU').innerText = num;
}

// Loads the Enter room modal at startup
function loadModal() {
    document.getElementById('id01').style.display = 'block';
}

loadModal();
getUserNum();