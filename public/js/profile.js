
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
console.log("Profile Page");
