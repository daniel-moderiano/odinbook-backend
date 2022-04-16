const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const { body, validationResult } = require("express-validator");
const upload = require('../config/multer');
const cloudinary = require('cloudinary').v2;
const config = require('../config/cloudinary');
const mongoose = require('mongoose');
const passport = require('passport');

// This function has been delegated to it's own module because of the complexity involved in this multi-step db query

// @desc    Delete an entire user account
// @route   DELETE /api/users/:userId/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  // Obtain the user's details for User doc deletion. Note the user's _id will be key to identifying their presence across the entire db for complete removal
  const user = await User.findById(req.params.userId);

  // All outgoing requests should be cancelled. All incoming requests should be deleted/denied. All confirmed friends should be removed on both ends. 
  const friends = user.friends;

  // Obtain all comments by this user
  const comments = await Comment.find({ 'user': req.params.userId })

  // Obtain all posts by this user
  const userPosts = await Post.find({ 'user': req.params.userId })

  // Obtain all posts that the user has liked
  const likedPosts = await Post.find({ 'likes': req.params.userId })

  await user.remove();

  if (!user) {  // user not found in db, above query returns null
    res.status(400);
    throw new Error('User not found');
  }
  res.status(200).json({
    user: user
  })
});

const practiceQuery = asyncHandler(async (req, res) => {
  // Obtain all posts that the user has liked
  const likedPosts = await Post.find({ 'likes': req.params.userId })

  // const updatedPosts = await Post.updateMany(
  //   { 'likes': req.params.userId },
  //   { $pull: { 'likes': req.params.userId } }
  // )

  // res.status(200).json(updatedPosts)
  res.status(200).json(likedPosts)
});

module.exports = {
  deleteAccount,
  practiceQuery
}
