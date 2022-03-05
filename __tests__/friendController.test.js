const { checkExistingEntries, modifyForAcceptRequest, modifyForCancelRequest, modifyForDeleteRequest, modifyForSendRequest } = require('../controllers/friendController');

const sender = {
  id: 'ron',
  friends: [],
};
const recipient = {
  id: 'harry',
  friends: []
};


// Push purposely clashing entires into friends array before running tests
describe("checkExistingEntries function can identify existing entires of all sorts in a user's friends array", () => {
  // Reset arrays prior to each test
  beforeEach(() => {
    sender.friends = [
      { user: 'hermione', status: 'friend' },
      { user: 'ginny', status: 'outgoing' },
      { user: 'luna', status: 'incoming' },
      { user: 'neville', status: 'deleted' }
    ];
  })

  test('Return null when no clashing entires exist', () => {
    expect(checkExistingEntries(recipient.id, sender.friends)).toBe(null);
  });

  test("Return 'incoming' when the recipient has already sent the sender a request", () => {
    sender.friends.push({ user: 'harry', status: 'incomingRequest' });
    expect(checkExistingEntries(recipient.id, sender.friends)).toBe('incomingRequest');
  });

  test("Return 'outgoing' when the sender has already sent the recipient a request", () => {
    sender.friends.push({ user: 'harry', status: 'outgoingRequest' });
    expect(checkExistingEntries(recipient.id, sender.friends)).toBe('outgoingRequest');
  });

  test("Return 'deleted' when the recipient has deleted a previous request from the sender", () => {
    sender.friends.push({ user: 'harry', status: 'deletedRequest' });
    expect(checkExistingEntries(recipient.id, sender.friends)).toBe('deletedRequest');
  });

  test("Return 'friend' when the recipient and sender are already friends", () => {
    sender.friends.push({ user: 'harry', status: 'friend' });
    expect(checkExistingEntries(recipient.id, sender.friends)).toBe('friend');
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
    sender.friends = [{ user: 'ron', status: 'outgoingRequest' }];
    recipient.friends = [{ user: 'harry', status: 'incomingRequest' }];
    modifyForAcceptRequest(sender, recipient);
    expect(sender.friends[0].status).toBe('friend');
  });

  test('Accepting a request modifies recipient array accordingly', () => {
    sender.friends = [{ user: 'ron', status: 'outgoingRequest' }];
    recipient.friends = [{ user: 'harry', status: 'incomingRequest' }];
    modifyForAcceptRequest(sender, recipient);
    expect(recipient.friends[0].status).toBe('friend');
  });

  test("Deleting a request modifies sender array accordingly", () => {
    sender.friends = [{ user: 'ron', status: 'incomingRequest' }];
    recipient.friends = [{ user: 'harry', status: 'outgoingRequest' }];
    modifyForDeleteRequest(sender, recipient);
    expect(sender.friends.length).toBe(0);
  });
  
  test("Deleting a request modifies recipient array accordingly", () => {
    sender.friends = [{ user: 'ron', status: 'incomingRequest' }];
    recipient.friends = [{ user: 'harry', status: 'outgoingRequest' }];
    modifyForDeleteRequest(sender, recipient);
    expect(recipient.friends[0].status).toBe('deletedRequest');
  });

  test("Cancelling a request modifies sender array accordingly", () => {
    sender.friends = [{ user: 'ron', status: 'outgoingRequest' }];
    recipient.friends = [{ user: 'harry', status: 'incomingRequest' }];
    modifyForCancelRequest(sender, recipient);
    expect(sender.friends.length).toBe(0);
  });

  test("Cancelling a request modifies recipient array accordingly", () => {
    sender.friends = [{ user: 'ron', status: 'outgoingRequest' }];
    recipient.friends = [{ user: 'harry', status: 'incomingRequest' }];
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
});

