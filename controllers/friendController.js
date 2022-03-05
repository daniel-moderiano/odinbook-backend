// Use this function to ensure that no duplicate requests are sent, and that certain request types exist before performing related actions  
const checkExistingEntries = (userId, friendsArray) => {
  // Identify existing request for the user in the friendsArray provided. There should never be more than one existing entry
  const existingRequests = friendsArray.filter((request) => request.user === userId);

  if (existingRequests.length === 0) {  // No request exists, exit function here
    return null;
  } else {  // Existing request is present. Return type of request.
    return existingRequests[0].status;
  }
};

// Adjust sender and recipient friend arrays when a request is to be sent
const modifyForSendRequest = (sender, recipient) => {
  sender.friends.push({   // add outgoing request to sender doc
    user: recipient._id,
    status: 'outgoingRequest'
  });

  recipient.friends.push({   // add incoming request to recipient doc
    user: sender._id,
    status: 'incomingRequest'
  });
};

// Adjust sender and recipient friend arrays when a request is to be accepted
const modifyForAcceptRequest = (sender, recipient) => {
  // Find the friend requests amongst the array of friends
  const incomingRequestIndex = sender.friends.findIndex((request) => request.user === recipient._id);
  const outgoingRequestIndex = recipient.friends.findIndex((request) => request.user === sender._id);

  // Modify the status values
  sender.friends[incomingRequestIndex].status = 'friend';
  recipient.friends[outgoingRequestIndex].status = 'friend';
};

// Adjust sender and recipient friend arrays when a request is to be cancelled
const modifyForCancelRequest = (sender, recipient) => {
  // Find the friend requests amongst the array of friends
  const outgoingRequestIndex = sender.friends.findIndex((request) => request.user === recipient._id);
  const incomingRequestIndex = recipient.friends.findIndex((request) => request.user === sender._id);

  // Modify the status values
  sender.friends.splice(outgoingRequestIndex, 1);
  recipient.friends.splice(incomingRequestIndex, 1);
};

// Adjust sender and recipient friend arrays when a request is to be deleted
const modifyForDeleteRequest = (sender, recipient) => {
  // Find the friend requests amongst the array of friends
  const incomingRequestIndex = sender.friends.findIndex((request) => request.user === recipient._id);
  const outgoingRequestIndex = recipient.friends.findIndex((request) => request.user === sender._id);

  // Modify the status values
  sender.friends.splice(incomingRequestIndex, 1);
  recipient.friends[outgoingRequestIndex].status = 'deletedRequest';
};


// ! PUT can be done using any data you manually enter in the request body from the front end! Can specify type of update there!
// Expected API route would be PUT api/friends/:userId
const handleFriendRequest = async (req, res) => {
  // Req.user will contain the sender's details
  // When clicking on another user's details, their ID should be captured and passed into the req.params.userId for example
  // In all friend request functions, the requestSender describes the currently logged in user that is making a request of some kind, be it sending, accepting, cancelling, or deleting. The recepient describes the user that is the target of the sender's request, again regardless of if the sender if sending a request to that user, or accepting a request from that user
  const requestRecipient = await User.findById(req.params.userId, 'firstName lastName profilePic friends');
  const requestSender = await User.findById(req.user._id, 'firstName lastName profilePic friends');

  if (!requestRecipient) {  // user not found in db
    res.status(400);
    throw new Error('User not found');
  } 

  // Incoming req.body will contain the type of operation required. Perform logic as needed
  switch (req.body.requestType) {
    case 'sendRequest':   // user is sending a friend request to another user
      const existingRequest = checkExistingEntries(requestRecipient._id, requestSender.friends);
      if (!existingRequest) {
        // Request able to be sent. Adjust receipeint and sender's friends as needed
        requestRecipient.friends.push({   // add incoming request to recipient doc
          user: req.user._id,
          status: 'incomingRequest'
        });

        requestSender.friends.push({   // add outgoing request to sender doc
          user: req.params.userId,
          status: 'outgoingRequest'
        });
        break;
      } else {
        // Request cannot be sent. Customise error message depending on reason
      }

      break;

    case 'acceptRequest':   // user is accepting a friend request from another user
      // Ensure an incoming request exists 
      if (!incomingRequestExists(req.params.userId, requestSender.friends)) {
        res.status(400);
        throw new Error('Request does not exist from this user');
      }

      // Request able to be accepted. Adjust recipient and sender's friends as needed
      // ! No push function here, instead modiy the existing friend entry
      requestRecipient.friends.push({   // add incoming request to recipient doc
        user: req.user._id,
        status: 'incomingRequest'
      });

      requestSender.friends.push({   // add outgoing request to sender doc
        user: req.params.userId,
        status: 'outgoingRequest'
      });
      break;

    case 'deleteRequest':   // user is deleting a friend request from another user
      break;

    case 'cancelRequest':   // user is cancelling a friend request to another user
      break;

    default:
      break;
  }



  // Save these changes to the db
  const updatedRecipient = await requestRecipient.save();
  await requestSender.save();

  // Return information of recipient (to populate a 'request sent to: ' messaged in frontend. Check that password is not being sent here though!)
  res.json(updatedRecipient);
};

module.exports = {
  checkExistingEntries,
  modifyForAcceptRequest,
  modifyForCancelRequest,
  modifyForSendRequest,
  modifyForDeleteRequest,
}