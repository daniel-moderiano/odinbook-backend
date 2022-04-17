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

// Removes all instances of the user's ID from comment and post likes arrays
const removeAllLikes = async (userId) => {
  // Remove all likes this user has submitted for all posts
  await Post.updateMany(
    { 'likes': req.params.userId },   // find all posts the user has liked
    { $pull: { 'likes': req.params.userId } }   // remove the likes from the likes array
  )

  // Remove all likes this user has submitted for all comments
  await Comment.updateMany(
    { 'likes': req.params.userId },   // find all comments the user has liked
    { $pull: { 'likes': req.params.userId } }   // remove the likes from the likes array
  )
};

// Removes all comment documents made by the user, and any references to these comments amongst all posts
const removeAllComments = async (userId) => {
  // Obtain all comments by this user
  const comments = await Comment.find({ 'user': req.params.userId });

  // Isolate the comment IDs (can't do this with a projection otherwise the virtuals cannot be 'got' with the getter and an error is thrown - since virtuals are set to true in the Comment Model)
  const commentIds = comments.map((comment) => comment._id);

  // Remove all comments by this user
  await Comment.deleteMany({ 'user': req.params.userId });

  // Remove all reference to comments by this user on posts
  await Post.updateMany(
    { 'comments': { $in: commentIds } },   // find all posts the user has commented on
    { $pull: { 'comments': { $in: commentIds } } }   // remove the comment from the comments array
  )
}

// TODO
const removeAllPosts = async(userId) => {
  // TODO: remove all comments attached to removed posts
  // TODO: remove all images attached to posts
  // Remove all posts by this user
  Post.deleteMany({ 'user': req.params.userID });
}

const removeAllFriends = async(userId) => {
  await User.updateMany(
    { 'friends.user': req.params.userId },    // find all users with this user as a friend of some type
    { $pull: { 'friends': { 'user': req.params.userId } } }   // remove all friend entries for this user
  )
};

// Remove the user document. This should be the very last operation.
const removeUser = async(userId) => {
  const user = await User.findById(req.params.userId);

  if (!user) {  // User not found in db
    res.status(400);
    throw new Error('User not found');
  }
  // Remove image from cloudinary if image exists
  if (user.profilePic) {
    cloudinary.uploader.destroy(user.profilePic.imageId);
  }
  // User found with no errors; remove from db
  await user.remove();
  res.status(200).json({
    user: { 
      id: req.params.userId 
    }
  });
}


const practiceQuery = asyncHandler(async (req, res) => {


  res.status(200).json(removed)
});

module.exports = {
  practiceQuery
}
