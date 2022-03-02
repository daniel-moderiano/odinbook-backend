const asyncHandler = require('express-async-handler');

// @desc    Get all comments
// @route   GET /api/posts/:postId/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  res.status(200).json({ comments: [] })
});

// @desc    Get single comment
// @route   GET /api/posts/:postId/comments/:commentId
// @access  Private
const getComment = asyncHandler(async (req, res) => {
  res.status(200).json({ comment: 'Comment data' })
});

// @desc    Add new comment
// @route   POST /api/posts/:postId/comments/
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  res.status(200).json({ comment: 'Comment data' })
});

// @desc    Update single post
// @route   PUT /api/posts/:postId/comments/:commentId
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  res.status(200).json({ comment: 'Comment data' })
});

// @desc    Like a single post (i.e. add new user to likes array)
// @route   PUT /api/posts/:postId/comments/:commentId/likes
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  res.status(200).json({ comment: 'Comment data' })
});

// @desc    Delete single post
// @route   DELETE /api/posts/:postId/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  res.status(200).json({ comment: 'Comment data' })
});

module.exports = {
  getComments,
  getComment,
  addComment,
  updateComment,
  likeComment,
  deleteComment
}