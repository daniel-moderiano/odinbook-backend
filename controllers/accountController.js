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

  // Remove all comments by this user

  // Remove all reference to comments by this user on posts

  // Obtain all posts by this user
  const userPosts = await Post.find({ 'user': req.params.userId })

  // Remove all likes this user has submitted for all posts
  await Post.updateMany(
    { 'likes': req.params.userId },   // find all posts the user has liked
    { $pull: { 'likes': req.params.userId } }   // remove the likes from the likes array
  )

  // Remove all likes this user has submitted for all comments

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
  // const comments = await Comment.find({ 'user': req.params.userId });

  // const deleted = await Comment.deleteMany({ 'user': req.params.userId })

  // const deleted = await Post.find({ 'comments.user': req.params.userId })

  // const deleted = await Post.updateMany(
  //   { 'comments.user': req.params.userId },   // find all posts the user has liked
  //   { $pull: { 'likes': req.params.userId } }   // remove the likes from the likes array
  // )

  const deleted = await Comment.findByIdAndDelete(req.params.userId)

  // Also remove the reference to this comment in the corresponding post
  // await Post.updateOne(
  //   { 'comments': req.params.userId },   // find all posts the user has liked
  //   { $pull: { 'comments': req.params.userId } }   // remove the likes from the likes array
  // )

  // const deleted = await Post.updateOne(
  //   { 'comments': req.params.userId },   // find all posts the user has liked
  //   { $pull: { 'comments': req.params.userId } }   // remove the likes from the likes array
  // )


  res.status(200).json(deleted)
});

module.exports = {
  deleteAccount,
  practiceQuery
}
