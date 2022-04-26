const asyncHandler = require('express-async-handler');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const { body, validationResult } = require("express-validator");
const mongoose = require('mongoose');
const upload = require('../config/multer');
const cloudinary = require('cloudinary').v2;
const config = require('../config/cloudinary');
const generateAltText = require('../utils/altTextGenerator');
// Note req.params.id of any kind is cast to ObjectID before a search query is run. Therefore, injection attacks do not have a foothold here (error will be thrown regardless).

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .populate('user', 'firstName lastName profilePic')
    .populate({   // this is useful as likes are not their own schema/collection
      path: 'likes',
      select: 'firstName lastName profilePic'
    })
  res.status(200).json(posts)
});

// @desc    Get single post
// @route   GET /api/posts/:postId
// @access  Private
const getPost = asyncHandler(async (req, res) => {
  // Retrieve post and populate only those user details required for display on posts (virtual 'fullName' can be called when first and last name are populated)
  const post = await Post.findById(req.params.postId)
    .populate('user', 'firstName lastName profilePic')
    .populate({   // this is useful as likes are not their own schema/collection
      path: 'likes',
      select: 'firstName lastName profilePic'
    })

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
  // Check for either post text OR image upload to allow a user to post image only or text only, but not a post with neither
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

    // Generate alt text for an image (if an image exists)
    let altText = '';

    if (req.file) {   // image exists
      altText = await generateAltText(req.file.path);
    }

    // Create new post
    const newPost = new Post({
      user: req.user._id, // req.user is created by the auth middleware when accessing any protected route
      text: req.body.text, 
      likes: [],
      comments: [],
      image: req.file && {
        imageId: req.file.filename,
        imageUrl: req.file.path,
        altText,
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

  // Image upload should occur to handle any new image the user may have added in the update
  upload.single('image'),
  // Check for either post text OR image upload to allow a user to post image only or text only, but not a post with neither
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

      // If the user has updated the image (imageUpdated === true), the previous image should be removed from Cloudinary.
      // A new image property should be created if a new image exists, otherwise a blank property is used to overwrite the existing image data
      // Booleans cannot be set in form data object, so check for string version of boolean
      if (req.body.imageUpdated === 'true') {
        if (post.image.imageId) {   // previous image exists on db/cloudinary
          cloudinary.uploader.destroy(post.image.imageId, (err, result) => {
            if (err) {    // error occurred with deletion, however safe to continue db post update
              console.log(err);
            }
          });
        }
        if (req.file) {   // new image added
        // Generate alt text for the new image, and overrride any existing alt text
          let altText = '';
          altText = await generateAltText(req.file.path);

          post.image = {
            imageId: req.file.filename,
            imageUrl: req.file.path,
            altText,
          }
        } else {
          post.image = undefined;
        }
      };

      post.text = req.body.text;
      await post.save();
      
      res.status(200).json(post);   // Return status OK and updated post to client
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
  // Use findOneAndDelete to return the deleted post after deletion
  const post = await Post.findOneAndDelete({ _id: req.params.postId });

  if (!post) {  // Post not found in db
    res.status(400);
    throw new Error('Post not found');
  }

  // Remove image from cloudinary if image exists
  if (Object.keys(post.image) > 0) {
    cloudinary.uploader.destroy(post.image.imageId, (err, result) => {
      if (err) {    // error occurred with delete operation. Log error but continue with post deletion
        console.log(err);
      }
    });
  }
  
  res.status(200).json(post); // Might consider returning the deleted post itself here
});

module.exports = {
  getAllPosts,
  getPost,
  addPost,
  updatePost,
  likePost,
  deletePost,
}