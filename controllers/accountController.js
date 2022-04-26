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

// ! The order of deletion operations may be important, so follow the order of functions in this moduel

// Removes all instances of the user's ID from comment and post likes arrays
const removeAllLikes = async (userId) => {
  // Remove all likes this user has submitted for all posts
  await Post.updateMany(
    { 'likes': userId },   // find all posts the user has liked
    { $pull: { 'likes': userId } }   // remove the likes from the likes array
  )

  // Remove all likes this user has submitted for all comments
  await Comment.updateMany(
    { 'likes': userId },   // find all comments the user has liked
    { $pull: { 'likes': userId } }   // remove the likes from the likes array
  )
};

// Removes all the user's posts, images associated with these posts, and comments associated with these posts
const removeAllPosts = async(userId) => {
  // Find all posts by this user
  const posts = await Post.find({ 'user': userId });

  // Isolate those posts with images
  const postsWithImages = posts.filter((post) => post.image.imageId !== undefined);

  // Isolate image IDs of these post images
  const imageIds = postsWithImages.map((post) => post.image.imageId);

  // Remove bulk resources from Cloudinary (max 100 images)
  if (imageIds.length > 0) {    // post images exist
    cloudinary.api.delete_resources(imageIds, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  }

  // Finally, remove all posts by this user
  await Post.deleteMany({ 'user': userId });
}

// Removes all comment documents made by the user, and any references to these comments amongst all posts
const removeAllComments = async (userId) => {
  // Obtain all comments by this user
  const comments = await Comment.find({ 'user': userId });

  // Isolate the comment IDs (can't do this with a projection otherwise the virtuals cannot be 'got' with the getter and an error is thrown - since virtuals are set to true in the Comment Model)
  const commentIds = comments.map((comment) => comment._id);

  // Remove all comments by this user
  await Comment.deleteMany({ 'user': userId });

  // Remove all reference to comments by this user on posts
  await Post.updateMany(
    { 'comments': { $in: commentIds } },   // find all posts the user has commented on
    { $pull: { 'comments': { $in: commentIds } } }   // remove the comment from the comments array
  )
}

// Removes all instances of the user from other user's friend lists.
const removeAllFriends = async(userId) => {
  await User.updateMany(
    { 'friends.user': userId },    // find all users with this user as a friend of some type
    { $pull: { 'friends': { 'user': userId } } }   // remove all friend entries for this user
  )
};

// Remove the user document and any images.
const removeUser = async(userId) => {
  const user = await User.findById(userId);

  // Remove image from cloudinary if image exists
  if (user.profilePic) {
    cloudinary.uploader.destroy(user.profilePic.imageId);
  }
  // User found with no errors; remove from db
  await user.remove();
}

module.exports = {
  removeAllLikes,
  removeAllComments, 
  removeAllPosts,
  removeAllFriends,
  removeUser
}
