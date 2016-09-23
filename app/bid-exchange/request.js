import RequestModel from "../model/request/requester-model";
import axios from "axios";
import crypto from "crypto";

async function AddRequest(recipientID) {
  try {
    const findRequester = await RequestModel.findOne({ requester: recipientID, isRequesting: { $eq: true } }).lean();
    if (findRequester) {
      return "Hello, you currently have a request hanging \nIf you want to cancel this request, just send cancel";
    } else {
      const buf = crypto.randomBytes(3);
      const requestKey = buf.toString('hex');
      const addNewRequest = new RequestModel(Object.assign({}, {
        requester: recipientID,
        requestID: requestKey,
        isRequesting: true
      }));
      addNewRequest.save();
    }
  } catch (error) {
    console.trace("Error occured adding request", error);
  }
  return;
}


async function RemoveRequest(recipientID) {
  const findRequester = await RequestModel.findOne({ requester: recipientID }).lean();
  if (findRequester) {
    AbokiModel.findOneAndRemove({ requester: recipientID }, (err) => {});
    return "Request has been cancelled";
  } else {
    return "You had no existing requests";
  }
  return;
}

export default { AddRequest, RemoveRequest }