const asyncHandler = require('express-async-handler');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');

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