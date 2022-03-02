const asyncHandler = require('express-async-handler');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const Comment = require('../models/CommentModel');
const { body, validationResult } = require("express-validator");

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
  // Search db by comment ID directly, and populate only the user info to be displayed on the UI
  const comment = await Comment.findById(req.params.commentId).populate('user', 'firstName lastName profilePic');

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
const addComment = [
  // Validate text input. No sanitisation taking place here; this data is not used to execute any commands. Take care to sanitise as needed on frontend output/use
  body('text', 'Comment text is required').trim().isLength({ min: 1 }),

  // Process request after input data has been validated
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create new comment
    const newComment = new Comment({
      user: req.user._id,   // requires currently logged in user, which will be in the request body
      text: req.body.text, 
      likes: [],
    });

    // Validation errors have occurred. Return these to the user is JSON format
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw error here, allow frontend to handle as needed
    } else {
      // Form data is valid. Save to db
      await newComment.save();
      res.status(200).json(newComment)   // Return status OK and new comment to client
    }
  }),
];

// @desc    Update single post
// @route   PUT /api/posts/:postId/comments/:commentId
// @access  Private
const updateComment = [
  // Validate data
  body('text', 'Comment text is required').trim().isLength({ min: 1 }),

  // Process request after input data has been validated
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Validation errors have occurred. Return these to the user
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw single error here, need to pass all errors to user instead
    } else {
      // Submitted data is valid
      // Check if comment exists in db
      const comment = await Comment.findById(req.params.commentId);

      if (!comment) {  // comment not found in db
        res.status(400);
        throw new Error('Comment not found');
      }

      // Update comment in db
      const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
        text: req.body.text,
      }, { new: true });  // { new: true } ensures the updated comment is returned

      res.status(200).json(updatedComment);   // Return status OK and updated comment to client
    }
  }),
];

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
  // Search comment directly by ID
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {  // comment not found in db
    res.status(400);
    throw new Error('Comment not found');
  }
  // No errors, remove comment from db
  await comment.remove();
  res.status(200).json({ id: req.params.commentId });  // Consider also returning the deleted comment
});

module.exports = {
  getComments,
  getComment,
  addComment,
  updateComment,
  likeComment,
  deleteComment
}