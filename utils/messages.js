const moment = require('moment');

function formatMessage(username, text, secret, pfp) {
  var txtArry = text.split("ßΓ");
  var msgText = txtArry[0];
  var nickname = txtArry[1];
  var team = txtArry[2];
  var xp = txtArry[3];
  var secretMode = secret;
  var pfpLink = pfp;
  // console.log("Message Text: ", txtArry);

  return {
    username,
    nickname,
    msgText,
    team,
    xp,
    time: moment().format('h:mm:ss a'),
    secretMode,
    pfpLink,
  };
}

module.exports = formatMessage;
