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
  sender.friends = [];
  recipeint.friends = [];
})


describe("checkExistingEntries function can identify existing entires of all sorts in a user's friends array", () => {
  test('Return null when no clashing entires exist', () => {
    expect(checkExistingEntries(sender.id, recipeint.friends)).toBe(null);
  });

  test("Return 'incoming' when the recipient has already sent the sender a request", () => {
    sender.friends.push({ user: 'harry', status: 'incoming' });
    expect(checkExistingEntries(sender.id, recipeint.friends)).toBe('incoming');
  });

  test("Return 'outgoing' when the sender has already sent the recipient a request", () => {
    sender.friends.push({ user: 'harry', status: 'outgoing' });
    expect(checkExistingEntries(sender.id, recipeint.friends)).toBe('incoming');
  });

  test("Return 'deleted' when the recipient has already sent the sender a request", () => {
    sender.friends.push({ user: 'harry', status: 'deleted' });
    expect(checkExistingEntries(sender.id, recipeint.friends)).toBe('outgoing');
  });

  test("Return 'friend' when the recipient has already sent the sender a request", () => {
    sender.friends.push({ user: 'harry', status: 'friend' });
    expect(checkExistingEntries(sender.id, recipeint.friends)).toBe('friend');
  });
});

