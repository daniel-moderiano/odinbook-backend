const asyncHandler = require('express-async-handler');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const { body, validationResult } = require("express-validator");
const mongoose = require('mongoose');
const upload = require('../config/multer');
const cloudinary = require('cloudinary').v2;
const config = require('../config/cloudinary');
// Note req.params.id of any kind is cast to ObjectID before a search query is run. Therefore, injection attacks do not have a foothold here (error will be thrown regardless).

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
  upload.single('image'),
  // Check for either post text OR image upload to allow a user to post imagae only or text only, but not a post with neither
  body('text').custom((value, { req }) => {
    if ((!value || value.trim().length === 0) && !req.file) {   // neither text nor image has been provided
      throw new Error('Post text or image is required');
    }
    // User has included one of either text or image. Continue with request handling
    return true;
  }),

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
      image: req.file && {
        imageId: req.file.filename,
        imageUrl: req.file.path,
      }
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
const updatePost = [
  // Validate text input. No sanitisation taking place here; this data is not used to execute any commands. Take care to sanitise as needed on frontend output/use
  // TODO image handling
  body('text', 'Post text is required').trim().isLength({ min: 1 }),

  // Process request after input data has been validated
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Validation errors have occurred. Return these to the user
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw single error here, need to pass all errors to user instead
    } else {
      // Submitted data is valid
      // Check if post exists in db
      const post = await Post.findById(req.params.postId);

      if (!post) {  // comment not found in db
        res.status(400);
        throw new Error('Post not found');
      }

      // Update comment in db
      const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
        text: req.body.text,
      }, { new: true });  // { new: true } ensures the updated comment is returned

      res.status(200).json(updatedPost);   // Return status OK and updated post to client
    }
  }),
];

// @desc    Like a single post (i.e. add new user to likes array)
// @route   PUT /api/posts/:postId/likes
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  // Check if post exists in db
  const post = await Post.findById(req.params.postId);

  if (!post) {  // post not found in db
    res.status(400)
    throw new Error('Post not found');
  }

  // Check if the user has already liked this post (i.e. their user ID already exists in likes array)
  const alreadyLiked = post.likes.some((user) => user.equals(mongoose.Types.ObjectId(req.user._id)));

  if (!alreadyLiked) {
    post.likes.push(req.user._id);
    await post.save();  // this acts as an update operation
    res.status(200).json(post)   // Return status OK and updated comment to client
  } else {
    // Throw error if user attempts to duplicate likes
    res.status(400)
    throw new Error('Post already liked');
  }
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
  // Remove image from cloudinary if image exists
  if (post.image) {
    cloudinary.uploader.destroy(post.image.imageId);
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