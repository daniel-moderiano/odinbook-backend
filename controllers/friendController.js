const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const mongoose = require('mongoose');

// Use this function to ensure that no duplicate requests are sent, and that certain request types exist before performing related actions  
const checkExistingEntries = (userId, friendsArray) => {
  // Identify existing request for the user in the friendsArray provided. There should never be more than one existing entry. NOTE: .equals() must be used to compare ObjectID types here.
  const existingRequests = friendsArray.filter((request) => request.user.equals(userId));

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
  const incomingRequestIndex = sender.friends.findIndex((request) => request.user.equals(recipient._id));
  const outgoingRequestIndex = recipient.friends.findIndex((request) => request.user.equals(sender._id));
  console.log(incomingRequestIndex, outgoingRequestIndex);

  // Modify the status values
  sender.friends[incomingRequestIndex].status = 'friend';
  recipient.friends[outgoingRequestIndex].status = 'friend';
};

// Adjust sender and recipient friend arrays when a request is to be cancelled
const modifyForCancelRequest = (sender, recipient) => {
  // Find the friend requests amongst the array of friends
  const outgoingRequestIndex = sender.friends.findIndex((request) => request.user.equals(recipient._id));
  const incomingRequestIndex = recipient.friends.findIndex((request) => request.user.equals(sender._id));

  // Modify the status values
  sender.friends.splice(outgoingRequestIndex, 1);
  recipient.friends.splice(incomingRequestIndex, 1);
};

// Adjust sender and recipient friend arrays when a request is to be deleted
const modifyForDeleteRequest = (sender, recipient) => {
  // Find the friend requests amongst the array of friends
  const incomingRequestIndex = sender.friends.findIndex((request) => request.user.equals(recipient._id));
  const outgoingRequestIndex = recipient.friends.findIndex((request) => request.user.equals(sender._id));

  // Modify the status values
  sender.friends.splice(incomingRequestIndex, 1);
  recipient.friends[outgoingRequestIndex].status = 'deletedRequest';
};


// @desc    Handle all friend requests
// @route   PUT /api/friends/:userId
// @access  Private
const handleFriendRequest = asyncHandler(async (req, res) => {
  // Req.user will contain the sender's details
  // When clicking on another user's details, their ID should be captured and passed into the req.params.userId for example
  // In all friend request functions, the requestSender describes the currently logged in user that is making a request of some kind, be it sending, accepting, cancelling, or deleting. The recepient describes the user that is the target of the sender's request, again regardless of if the sender if sending a request to that user, or accepting a request from that user
  const sender = await User.findById(req.user._id, 'firstName lastName profilePic friends');
  const recipient = await User.findById(req.params.userId, 'firstName lastName profilePic friends');
  
  if (!recipient) {  // user not found in db
    res.status(400);
    throw new Error('User not found');
  } 

  // Check for existing requests
  const existingRequest = checkExistingEntries(recipient._id, sender.friends);

  // Incoming req.body will contain the type of operation required. Perform logic as needed
  switch (req.body.requestType) {
    case 'sendRequest':   // user is sending a friend request to another user 
      if (!existingRequest) {
        // Request able to be sent. Adjust receipeint and sender's friends as needed
        modifyForSendRequest(sender, recipient);
        break;
      } else {
        // Request cannot be sent. Customise error message depending on reason
        res.status(400);
        switch (existingRequest) {
          case 'friend':
            throw new Error('User is already a friend');
    
          case 'incomingRequest':
            throw new Error('Incoming request exists from this user');
        
          case 'outgoingRequest':
            throw new Error('Outgoing request to this user already exists');
    
          case 'deletedRequest':
            throw new Error('User has denied friend request');
    
          default:
            throw new Error('Request unable to be completed');
        }
      }
    
    case 'acceptRequest':   // user is accepting a friend request from another user
      if (existingRequest === 'incomingRequest') {
        // Request able to be Accepted. Adjust receipeint and sender's friends as needed
        modifyForAcceptRequest(sender, recipient);
        break;
      } else {
        // Request cannot be accepted (none available)
        res.status(400);
        throw new Error('Request does not exist');
      }

    case 'deleteRequest':   // user is deleting a friend request from another user
      if (existingRequest === 'deletedRequest') {
        // Request able to be deleted. Adjust receipeint and sender's friends as needed
        modifyForDeleteRequest(sender, recipient);
        break;
      } else {
        // Request cannot be accepted (none available)
        res.status(400);
        throw new Error('Request does not exist');
      }

    case 'cancelRequest':   // user is cancelling a friend request to another user
      if (existingRequest === 'outgoingRequest') {
        // Request able to be deleted. Adjust receipeint and sender's friends as needed
        modifyForCancelRequest(sender, recipient);
        break;
      } else {
        // Request cannot be accepted (none available)
        res.status(400);
        throw new Error('Request does not exist');
      }

    default:
      // No request type or incorrect request type provided
      res.status(400);
      throw new Error('Request type missing or invalid');
  }

  // Save these changes to the db
  const updatedRecipient = await recipient.save();
  await sender.save();

  // Return information of recipient (to populate a 'request sent to: ' messaged in frontend. Check that password is not being sent here though!)
  res.json(updatedRecipient);
});

module.exports = {
  checkExistingEntries,
  modifyForAcceptRequest,
  modifyForCancelRequest,
  modifyForSendRequest,
  modifyForDeleteRequest,
  handleFriendRequest
}