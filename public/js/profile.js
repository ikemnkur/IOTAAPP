
function showFriends() {
    var tbl = document.getElementById("friendTbl");
    var tblData = document.getElementById("friendTblData");
    var tblDataJSON = JSON.parse(tblData.innerText);
    var tbody = document.createElement("tbody");
    console.log("Table Data: ", tblDataJSON);
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
function showRoomConfig() {

}
console.log("Profile Page");
showFriends();
console.log("Profile Page");
