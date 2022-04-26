const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { removeAllComments } = require('../controllers/accountController');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// User ID for user Peter Parker
const userId = '4c8a331bda76c559ef000004';

// Comment IDs for all comments by Peter
const commentIds = ["6254108b9302b7824770eb68", "4c8a331bda76c559ef000011"]

describe('Confirm user has expanded presence in the database', () => {
  test("user has comments", async () => {
    // User Peter should have 2 comments (written on different posts)
    const comments = await Comment.find({ _id: { $in: commentIds } });
    const posts = await Post.find({ comments: { $in: commentIds } });
    expect(comments.length).toBe(2);
    expect(posts.length).toBe(2);
  })
}); 

describe('removeAllLikes functionality', () => {
  beforeAll(() => removeAllComments(userId))

  it("removes all user's comments", async () => {
    const comments = await Comment.find({ user: userId });
    expect(comments.length).toBe(0);
  });

  it("removes all references to the user's comments from their corresponding posts", async () => {
    const posts = await Post.find({ comments: { $in: commentIds } });
    expect(posts.length).toBe(0);
  });
});