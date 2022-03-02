const asyncHandler = require('express-async-handler');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Some arbitrary message' })
});

// @desc    Get single post
// @route   GET /api/posts/:postId
// @access  Private
const getPost = asyncHandler(async (req, res) => {
  res.status(200).json({ post: 'Post data' })
});

// @desc    Add new post
// @route   POST /api/posts
// @access  Private
const addPost = asyncHandler(async (req, res) => {
  res.status(200).json({ post: 'Post data' })
});

// @desc    Update single post
// @route   PUT /api/posts/:postId
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  res.status(200).json({ post: 'Post data' })
});

// @desc    Like a single post (i.e. add new user to likes array)
// @route   PUT /api/posts/:postId/likes
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  res.status(200).json({ post: 'Post data' })
});

// @desc    Delete single post
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  res.status(200).json({ post: 'Post data' })
});

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  likePost,
  deletePost,
}