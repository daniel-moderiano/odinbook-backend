const { removeAllLikes } = require('../controllers/accountController');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// User ID for user Peter Parker
const userId = '4c8a331bda76c559ef000004';

describe('Confirm user has expanded presence in the database', () => {
  test("user has liked posts and comments", async () => {
    // Find all posts and comments the user has liked 
    const posts = await Post.find({ likes: userId });
    const comments = await Comment.find({ likes: userId });
    expect(posts.length).toBe(1);
    expect(comments.length).toBe(1);
  })
}); 

describe('removeAllLikes functionality', () => {
  beforeAll(() => removeAllLikes(userId))

  it("removes all user's likes from posts", async () => {
    // Find all posts the user has liked
    const posts = await Post.find({ likes: userId });
    expect(posts.length).toBe(0);
  });

  it("removes all user's likes from comments", async () => {
    // Find all comments the user has liked
    const comments = await Comment.find({ likes: userId });
    expect(comments.length).toBe(0);
  });
});