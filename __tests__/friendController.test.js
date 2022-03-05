const { checkExistingEntries } = require('../controllers/friendController');

const sender = {
  id: 'ron',
  friends: [
    { user: 'hermione', status: 'friend' },
    { user: 'ginny', status: 'outgoing' },
    { user: 'luna', status: 'incoming' },
    { user: 'neville', status: 'deleted' }
  ],
};
const recipeint = {
  id: 'harry',
  friends: [
    { user: 'hermione', status: 'friend' },
    { user: 'ginny', status: 'outgoing' },
    { user: 'luna', status: 'incoming' },
    { user: 'neville', status: 'deleted' }
  ],
};

// Reset both arrays before each test to avoid accumulating requests
beforeEach(() => {
  sender.friends = [
    { user: 'hermione', status: 'friend' },
    { user: 'ginny', status: 'outgoing' },
    { user: 'luna', status: 'incoming' },
    { user: 'neville', status: 'deleted' }
  ];
  recipeint.friends = [
    { user: 'hermione', status: 'friend' },
    { user: 'ginny', status: 'outgoing' },
    { user: 'luna', status: 'incoming' },
    { user: 'neville', status: 'deleted' }
  ];
})

describe("checkExistingEntries function can identify existing entires of all sorts in a user's friends array", () => {
  test('Return null when no clashing entires exist', () => {
    expect(checkExistingEntries(recipeint.id, sender.friends)).toBe(null);
  });

  test("Return 'incoming' when the recipient has already sent the sender a request", () => {
    sender.friends.push({ user: 'harry', status: 'incomingRequest' });
    expect(checkExistingEntries(recipeint.id, sender.friends)).toBe('incomingRequest');
  });

  test("Return 'outgoing' when the sender has already sent the recipient a request", () => {
    sender.friends.push({ user: 'harry', status: 'outgoingRequest' });
    expect(checkExistingEntries(recipeint.id, sender.friends)).toBe('outgoingRequest');
  });

  test("Return 'deleted' when the recipient has deleted a previous request from the sender", () => {
    sender.friends.push({ user: 'harry', status: 'deletedRequest' });
    expect(checkExistingEntries(recipeint.id, sender.friends)).toBe('deletedRequest');
  });

  test("Return 'friend' when the recipient and sender are already friends", () => {
    sender.friends.push({ user: 'harry', status: 'friend' });
    expect(checkExistingEntries(recipeint.id, sender.friends)).toBe('friend');
  });
});

