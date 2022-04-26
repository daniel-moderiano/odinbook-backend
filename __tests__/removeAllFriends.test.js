const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { removeAllFriends } = require('../controllers/accountController');
const User = require('../models/UserModel');

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// User ID for user Peter Parker
const userId = '4c8a331bda76c559ef000004';

describe('Confirm user has friends in the database', () => {
  test("user has friends/friend requests", async () => {
    // Peter has 5 total friend 'entries', with one deleted request. Therefore, 4 other users should have a reference to Peter. Those users are found below
    const friends = await User.find({ 'friends.user': userId });
    expect(friends.length).toBe(4);
  })
}); 

describe('removeAllFriends functionality', () => {
  beforeAll(() => removeAllFriends(userId));

  it("does not impact user's friend list", async () => {
    const user = await User.findById(userId);
    expect(user.friends.length).toBe(5);
  });

  it("removes all references to the user in other user's friend lists", async () => {
    const friends = await User.find({ 'friends.user': userId });
    expect(friends.length).toBe(0);
  });
});