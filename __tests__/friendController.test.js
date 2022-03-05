const { checkExistingEntries, modifyForAcceptRequest, modifyForCancelRequest, modifyForDeleteRequest, modifyForSendRequest } = require('../controllers/friendController');
const mongoose = require('mongoose');

// TODO: Convert these to proper ObjectIDs to fit with .equals() function

const sender = {
  _id: mongoose.Types.ObjectId('569ed8269353e9f4c51617aa'),
  friends: [],
};
const recipient = {
  _id: mongoose.Types.ObjectId('569ed8269353e9f4c51617ab'),
  friends: []
};


// Push purposely clashing entires into friends array before running tests
describe("checkExistingEntries function can identify existing entires of all sorts in a user's friends array", () => {
  // Reset arrays prior to each test
  beforeEach(() => {
    sender.friends = [
      { user: mongoose.Types.ObjectId('569ed8269353e9f4c51617ac'), status: 'friend' },
      { user: mongoose.Types.ObjectId('569ed8269353e9f4c51617ad'), status: 'outgoing' },
      { user: mongoose.Types.ObjectId('569ed8269353e9f4c51617ae'), status: 'incoming' },
      { user: mongoose.Types.ObjectId('569ed8269353e9f4c51617af'), status: 'deleted' }
    ];
  })

  test('Return null when no clashing entires exist', () => {
    expect(checkExistingEntries(recipient._id, sender.friends)).toBe(null);
  });

  test("Return 'incoming' when the recipient has already sent the sender a request", () => {
    sender.friends.push({ user: recipient._id, status: 'incomingRequest' });
    expect(checkExistingEntries(recipient._id, sender.friends)).toBe('incomingRequest');
  });

  test("Return 'outgoing' when the sender has already sent the recipient a request", () => {
    sender.friends.push({ user: recipient._id, status: 'outgoingRequest' });
    expect(checkExistingEntries(recipient._id, sender.friends)).toBe('outgoingRequest');
  });

  test("Return 'deleted' when the recipient has deleted a previous request from the sender", () => {
    sender.friends.push({ user: recipient._id, status: 'deletedRequest' });
    expect(checkExistingEntries(recipient._id, sender.friends)).toBe('deletedRequest');
  });

  test("Return 'friend' when the recipient and sender are already friends", () => {
    sender.friends.push({ user: recipient._id, status: 'friend' });
    expect(checkExistingEntries(recipient._id, sender.friends)).toBe('friend');
  });
});


// Push purposely clashing entires into friends array before running tests
describe("Modification functions make the correct adjustments to sender and recipient friend arrays", () => {
  // Reset arrays prior to each test
  beforeEach(() => {
    sender.friends = [];
    recipient.friends = [];
  });

  test('Accepting a request modifies sender array accordingly', () => {
    sender.friends = [{ user: recipient._id, status: 'incomingRequest' }];
    recipient.friends = [{ user: sender._id, status: 'outgoingRequest' }];
    modifyForAcceptRequest(sender, recipient);
    expect(sender.friends[0].status).toBe('friend');
  });

  test('Accepting a request modifies recipient array accordingly', () => {
    sender.friends = [{ user: recipient._id, status: 'incomingRequest' }];
    recipient.friends = [{ user: sender._id, status: 'outgoingRequest' }];
    modifyForAcceptRequest(sender, recipient);
    expect(recipient.friends[0].status).toBe('friend');
  });

  test("Deleting a request modifies sender array accordingly", () => {
    sender.friends = [{ user: recipient._id, status: 'incomingRequest' }];
    recipient.friends = [{ user: sender._id, status: 'outgoingRequest' }];
    modifyForDeleteRequest(sender, recipient);
    expect(sender.friends.length).toBe(0);
  });
  
  test("Deleting a request modifies recipient array accordingly", () => {
    sender.friends = [{ user: recipient._id, status: 'incomingRequest' }];
    recipient.friends = [{ user: sender._id, status: 'outgoingRequest' }];
    modifyForDeleteRequest(sender, recipient);
    expect(recipient.friends[0].status).toBe('deletedRequest');
  });

  test("Cancelling a request modifies sender array accordingly", () => {
    sender.friends = [{ user: recipient._id, status: 'outgoingRequest' }];
    recipient.friends = [{ user: sender._id, status: 'incomingRequest' }];
    modifyForCancelRequest(sender, recipient);
    expect(sender.friends.length).toBe(0);
  });

  test("Cancelling a request modifies recipient array accordingly", () => {
    sender.friends = [{ user: recipient._id, status: 'outgoingRequest' }];
    recipient.friends = [{ user: sender._id, status: 'incomingRequest' }];
    modifyForCancelRequest(sender, recipient);
    expect(recipient.friends.length).toBe(0);
  });

  test("Sending a request modifies sender array accordingly", () => {
    modifyForSendRequest(sender, recipient);
    expect(sender.friends[0].status).toBe('outgoingRequest');
  });

  test("Sending a request modifies recipient array accordingly", () => {
    modifyForSendRequest(sender, recipient);
    expect(recipient.friends[0].status).toBe('incomingRequest');
  });

  test("Sending a request does not stack with a previous deletedRequest in recipient array for that user", () => {
    recipient.friends = [{ user: sender._id, status: 'deletedRequest' }];
    modifyForSendRequest(sender, recipient);
    expect(recipient.friends.length).toBe(1);
  });

  test("Sending a request replaces a previous deletedRequest in recipient array with a new incoming request", () => {
    recipient.friends = [{ user: sender._id, status: 'deletedRequest' }];
    modifyForSendRequest(sender, recipient);
    expect(recipient.friends[0].status).toBe('incomingRequest');
  });
});

