const asyncHandler = require('express-async-handler');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const Comment = require('../models/CommentModel');

// @desc    Get all comments
// @route   GET /api/posts/:postId/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  // Find comments via post ID, and use projection + populate to retrieve the comments array with comment details
  const post = await Post.findById(req.params.postId, 'comments').populate('comments');
  res.status(200).json(post.comments)
});

// @desc    Get single comment
// @route   GET /api/posts/:postId/comments/:commentId
// @access  Private
const getComment = asyncHandler(async (req, res) => {
  // Search db by comment ID since comments are models with their own IDs
  const comment = await Comment.findById(req.params.commentId).populate('user', 'firstName lastName');

  if (!comment) {  // comment not found in db
    res.status(400)
    throw new Error('Comment not found');
  }
  // No errors, return comment
  res.status(200).json(comment);
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