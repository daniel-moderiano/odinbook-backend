// Example user models
const ron = {
  _id: '1234',
  name: 'ron',
  friends: []
}

const harry = {
  _id: '5678',
  name: 'peter',
  friends: []
}


// Returns true where there is already an outgoing request to the user
const outgoingRequestExists = (userId, friendsArray) => {
  return friendsArray.some((request) => (
    request.status === 'outgoingRequest' && request.user === userId
  ));
};

// Returns true where there is already an incoming request from the user
const incomingRequestExists = (userId, friendsArray) => {
  return friendsArray.some((request) => (
    request.status === 'incomingRequest' && request.user === userId
  ));
};

// Returns true where there is already an deleted request from the user
const deletedRequestExists = (userId, friendsArray) => {
  return friendsArray.some((request) => (
    request.status === 'deleted' && request.user === userId
  ));
};

// Consider abstracting the different logic in the hadnle func below, e.g. func for send, accept, delete, and cancel request

// Both users are initialised with empty friend arrays. Friend request operations and desired outcomes will be brainstormed below.

// const sendFriendRequest = (sender, recipient) => {
//   // Check all relevant cases where a new request cannot be sent
//   if (outgoingRequestExists(recipient._id, sender.friends)) {
//     res.status(400);
//     throw new Error('Request has already been sent to this user');
//   }

//   if (incomingRequestExists(recipient._id, sender.friends)) {
//     res.status(400);
//     throw new Error('Request already exists from this user');
//   }

//   if (deletedRequestExists(recipient._id, sender.friends)) {
//     res.status(400);
//     throw new Error('User has denied your request');
//   }

//   // Request able to be sent. Adjust receipeint and sender's friends as needed
//   recipient.friends.push({   // add incoming request to recipient doc
//     user: req.user._id,
//     status: 'incomingRequest'
//   });

//   sender.friends.push({   // add outgoing request to sender doc
//     user: req.params.userId,
//     status: 'outgoingRequest'
//   });

//   return 
// }

const checkExistingEntries = (userId, friendsArray) => {
  // Identify existing request for the user in the friendsArray provided. There should never be more than one existing
  const existingRequests = friendsArray.filter((request) => request.user === userId);

  console.log(friendsArray);

  if (existingRequests.length === 0) {  // No request exists, exit function here
    return null;
  } else {  // Existing request is present. Return type of request.
    return existingRequests[0].status;
  }
}

// ! PUT can be done using any data you manually enter in the request body from the front end! Can specify type of update there!
// Expected API route would be PUT api/friends/:userId
const handleFriendRequest = async (req, res) => {
  // Req.user will contain the sender's details
  // When clicking on another user's details, their ID should be captured and passed into the req.params.friendId for example
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
      // Check all relevant cases where a new request cannot be sent
      if (outgoingRequestExists(req.params.userId, requestSender.friends)) {
        res.status(400);
        throw new Error('Request has already been sent to this user');
      }

      if (incomingRequestExists(req.params.userId, requestSender.friends)) {
        res.status(400);
        throw new Error('Request already exists from this user');
      }

      if (deletedRequestExists(req.params.userId, requestSender.friends)) {
        res.status(400);
        throw new Error('User has denied your request');
      }

      // ! Check if freind exists!! 

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

    case 'acceptRequest':   // user is accepting a friend request from another user
      // Ensure an incoming request exists 
      if (!incomingRequestExists(req.params.userId, requestSender.friends)) {
        res.status(400);
        throw new Error('Request does not exist from this user');
      }

      // Request able to be accepted. Adjust recipeint and sender's friends as needed
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


// SCENARIO: Harry accepts Ron's friend request
// User models will need to end up as
ron.friends = [{ user: '5678', status: 'friend' }];
harry.friends = [{ user: '1234', status: 'friend' }];

// Expected API route would be PUT api/friends/:friendId
const sendFriendRequest = async (req, res) => {
  // Req.user will contain Ron's details
  // When clicking on another user's details, their ID should be captured and passed into the req.params.friendId for example
  const requestRecipient = await User.findById(req.params.friendId, 'firstName lastName profilePic friends');
  const requestSender = await User.findById(req.user._id, 'firstName lastName profilePic friends');
  if (!requestRecipient) {  // user not found in db
    res.status(400);
    throw new Error('User not found');
  } 

  // Request recipient is valid, amend both sender and receiver arrays accordingly
  requestRecipient.friends.push({   // add incoming request to recipient doc
    user: req.user._id,
    status: 'incomingRequest'
  });

  requestSender.friends.push({   // add outgoing request to sender doc
    user: req.params.friendId,
    status: 'outgoingRequest'
  });

  // Save these changes to the db
  await requestRecipient.save();
  await requestSender.save();

  // Return information of recipient (to populate a 'request sent to: ' messaged in frontend. Check that password is not being sent here though!)
  res.json(updatedRecipient);
};




// Ron send request to harry
ron.friends = [{ user: '5678', status: 'outgoingRequest' }]
harry.friends = [{ user: '1234', status: 'incomingRequest' }]

// Ron attempts to resend a friend request to Harry
// Must search Ron's friends array for an entry with Harry's user ID, then review whether this is outgoing, incoming, or deleted. This should be adjusted with frontend rendering to disable duplicate requests anyway, but backend should protect against it either way to be sure


// Harry accepts request
ron.friends = [{ user: '5678', status: 'friend' }]
harry.friends = [{ user: '1234', status: 'friend' }]

const test = [
    { user: '5678', status: 'friend' },
    { user: '1234', status: 'outgoingRequest' },
    { user: '3456', status: 'outgoingRequest' },
    { user: '1277', status: 'outgoingRequest' },
    { user: '1234', status: 'incomingRequest' },
]

module.exports = {
  checkExistingEntries,
}