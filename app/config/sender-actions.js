import request from "request";
import callSendAPI from "./send-requests";

function sendTyping(recipientId) {
  const actionData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  }
  callSendAPI(actionData);
}

//Apparently this isn't working on FB
//But it's on their doc
function sendMarkAsSeen(recipientId) {
  const actionData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  }
  callSendAPI(actionData);
}

function sendActions(recipientId, senderID) {
  sendTyping(recipientId);
  sendMarkAsSeen(senderID);
}

// function callSendAction(actionData) {
//   request({
//     uri: "https://graph.facebook.com/v2.6/me/messages",
//     qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
//     method: 'POST',
//     json: actionData
//   })
// }


export default sendActions;
