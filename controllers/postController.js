const asyncHandler = require('express-async-handler');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const { body, validationResult } = require("express-validator");

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts)
});

// @desc    Get single post
// @route   GET /api/posts/:postId
// @access  Private
const getPost = asyncHandler(async (req, res) => {
  // Retrieve post and populate only those user details required for display on posts (virtual 'fullName' can be called when first and last name are populated)
  const post = await Post.findById(req.params.postId).populate('user', 'firstName lastName profilePic');

  if (!post) {  // post not found in db, above query returns null
    res.status(400);
    throw new Error('Post not found');
  }
  res.status(200).json(post)
});

// @desc    Add new post
// @route   POST /api/posts
// @access  Private
const addPost = [
  // Validate text input. No sanitisation taking place here; this data is not used to execute any commands. Take care to sanitise as needed on frontend output/use
  // TODO - once image upload is implemented, we can allow for empty post text provided an image is uploaded
  body('text', 'Post text is required').trim().isLength({ min: 1 }),

  // Process request after input data has been validated
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create new post
    const newPost = new Post({
      user: req.user._id, // req.user is created by the auth middleware when accessing any protected route
      text: req.body.text, 
      likes: [],
      comments: [],
    });

    // Validation errors have occurred. Return these to the user is JSON format
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw single error here, pass all validation errors to client
    } else {
      // Form data is valid. Save to db
      await newPost.save();
      // Add new comment to the current post's comments array, using the newly created comment ID
      res.status(200).json(newPost)   // Return status OK and new comment to client
    }
  }),
];

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
  const post = await Post.findById(req.params.postId);

  if (!post) {  // Post not found in db
    res.status(400);
    throw new Error('Post not found');
  }
  // Post found with no errors; remove from db
  await post.remove();
  res.status(200).json({ id: req.params.postId }); // Might consider returning the deleted post itself here
});

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  likePost,
  deletePost,
}