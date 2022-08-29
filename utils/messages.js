const moment = require('moment');

function formatMessage(username, text) {
  var txtArry = text.split("ßΓ");
  var nckName = txtArry[1];
  var msgText = txtArry[0];
  var team = txtArry[2];
  var xp = txtArry[3];
  console.log("Message Text: ", txtArry);

  return {
    username,
    nckName,
    msgText,
    team,
    xp,
    time: moment().format('h:mm:ss a')
  };
}

module.exports = formatMessage;
