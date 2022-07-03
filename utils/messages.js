const moment = require('moment');

function formatMessage(username, text) {
  var txtArry = text.split("ßΓ");
  var nckName = txtArry[1];
  var msgText = txtArry[0];
  var team = txtArry[2];;
  var xp;
  var points;
  return {
    username,
    nckName,
    msgText,
    team,
    time: moment().format('h:mm:ss a')
  };
}

module.exports = formatMessage;
