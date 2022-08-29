var modalJSONtext = document.getElementById("roomModalJSON");
const roomModalJSON = JSON.parse(modalJSONtext.innerText);

function roomModal() {

    var numbOfUsers = document.getElementById("NoU");
    var activeUsersList = roomModalJSON[0]["users"];
    console.log("Modal Users: ", activeUsersList);
    var activeUsersArray = JSON.parse(activeUsersList);
    var NoU = activeUsersArray.length;
    console.log("Number of Users: ", NoU);
    numbOfUsers.innerText = NoU;

}

roomModal();

var teams = roomModalJSON[0]["teams"];;

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