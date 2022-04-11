const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const { body, validationResult } = require("express-validator");
const upload = require('../config/multer');
const cloudinary = require('cloudinary').v2;
const config = require('../config/cloudinary');
const mongoose = require('mongoose');
const passport = require('passport');

// Note req.params.id of any kind is cast to ObjectID before a search query is run. Therefore, injection attacks do not have a foothold here (error will be thrown regardless).

// @desc    Get a user (public details)
// @route   GET /api/users/:userId
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  // Retrieve single user by user ID, retrieving only public details (no password)
  const user = await User.findById(req.params.userId, '-password')

  if (!user) {  // user not found in db, above query returns null
    res.status(400);
    throw new Error('User not found');
  }
  res.status(200).json({
    user: user
  })
});

// @desc    Get all users (public details)
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, 'firstName lastName profilePic');
  res.status(200).json({
    users: users
  })
});

// @desc    Return the currently logged in user
// @route   GET /api/users/current
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  // Retrieve current user from DB using req.user ID. Do not expose password here
  const user = await User.findById(req.user._id, { 'firstName': 1, 'lastName': 1, 'email': 1, 'profilePic': 1 });

  if (!user) {  // user not found in db, above query returns null
    res.status(400);
    throw new Error('User not found');
  }
  res.status(200).json({
    user: user
  });
});

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = [
  // Validate fields
  body('firstName', 'First name is required').trim().isLength({ min: 1 }),
  body('lastName', 'Last name is required').trim().isLength({ min: 1 }),
  // Validating email input here ensures no mongo query is somehow captured into req.body.email
  body('email').trim().isLength({ min: 1 }).withMessage('Email is required').isEmail().withMessage('A valid email is required'),
  body('password', 'Minimum password length is 6 characters').trim().isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this validator, i.e. passwords match
    return true;
  }),

  // Process request after input data has been validated
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Validation errors have occurred. Return these to the user
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw single error here, pass all validation errors
    } else {
      // Check for existing user in db
      const userExists = await User.findOne({ email: req.body.email });

      if (userExists) {
        res.status(400);
        throw new Error('Email already in use')
      }
      // User is unique. Create hashed pw and save user to db
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create new user with all required data
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword, 
        friends: [],
      });

      // Save user and pass on to authentication step to automatically log the user in
      await newUser.save();
      next();
    }
  }),

  // Passport auth system should authenticate the user automatically here
  passport.authenticate("local", { failWithError: true }), 
    (req, res) => {
      res.status(200);
      res.json({ user: {
        _id: req.user._id,
        email: req.user.email,
<<<<<<< HEAD
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        profilePic: req.user.profilePic,
=======
>>>>>>> 67547772a3958efb01d1417d1dd4b6869dab21f1
      }})
    },
];

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = [
  // Validate fields. isEmail prevents any mongo queries being passed as potential usernames, and removes the need for additional sanitisation
  body('email').trim().isLength({ min: 1 }).withMessage('Email is required').isEmail().withMessage('Please enter a valid email'),
  body('password', 'Password is required').trim().isLength({ min: 1 }),

  // Process request after input data has been validated
  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Validation errors have occurred. Return these to the user
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw single error here, pass and any all errors along
    } 

    next();
  }),

  // Call passport middleware to perform authentication process. This returns a user object on successful auth.
  // Must include 'failWithError' to enable error to propagate to custom error handler
  passport.authenticate("local", { failWithError: true }), 
    (req, res) => {
      res.status(200);
      res.json({ user: {
        _id: req.user._id,
        email: req.user.email,
<<<<<<< HEAD
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        profilePic: req.user.profilePic,
=======
>>>>>>> 67547772a3958efb01d1417d1dd4b6869dab21f1
      }})
    },
];

// @desc    Logout a user (end session)
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  if (!req.session) {   // session does not exists, user has already logged out/is not logged in
    res.status(400);
    throw new Error('Unable to log out')
  }

  // Session exists. Regardless of whether userId is present or not it should be destroyed
  // req.session.destroy();
  req.logout();
  res.status(200).json({  // Return status OK and logout message
    message: 'Log out successful'
  });   
});

// @desc    Update user details
// @route   PUT /api/users/:userId
// @access  Private
const updateUser = [ 
  // Validate fields
  body('firstName', 'First name is required').trim().isLength({ min: 1 }),
  body('lastName', 'Last name is required').trim().isLength({ min: 1 }),
  // Validating email input here ensures no mongo query is somehow captured into req.body.email
  body('email').trim().isLength({ min: 1 }).withMessage('Email is required').isEmail().withMessage('A valid email is required'),
  body('location', 'Location is too long (max 200 characters)').trim().isLength({ max: 200 }),
  body('occupation', 'Occupation is too long (max 200 characters)').trim().isLength({ max: 200 }),
  body('education', 'Education is too long (max 200 characters)').trim().isLength({ max: 200 }),
  body('gender', 'Gender is too long (max 50 characters)').trim().isLength({ max: 50 }),

  // Process request after input data has been validated
  asyncHandler(async (req, res, next) => {
    console.log(req.body);
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Validation errors have occurred. Return these to the user
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw single error here, pass all validation errors
    } else {
      // Submitted data is valid
      // Check if user exists in db
      const user = await User.findById(req.params.userId, { 'password': 0 });

      if (!user) {  // comment not found in db
        res.status(400);
        throw new Error('User not found');
      }

      user.firstName = req.body.firstName,
      user.lastName = req.body.lastName,
      user.email = req.body.email,
      user.bio = {
        location: req.body.location ? req.body.location : undefined,
        occupation: req.body.occupation ? req.body.occupation : undefined,
        education: req.body.education ? req.body.education : undefined,
        gender: req.body.gender ? req.body.gender : undefined
      };

      await user.save();
 
      res.status(200).json(user);   // Return status OK and updated user to client
    }
  }),
];

// @desc    Update user profile pic 
// @route   PUT /api/users/:userId/profile-pic
// @access  Private
const updateUserPic = [
  // Upload any profile picture added
  upload.single('image'),
  
  // Process request after input data has been validated
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Validation errors have occurred. Return these to the user
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw single error here, pass all validation errors
    } else {
      // Submitted data is valid
      // Check if user exists in db
      const user = await User.findById(req.params.userId, { 'password': 0 });

      if (!user) {  // comment not found in db
        res.status(400);
        throw new Error('User not found');
      }

      // If the user has updated their profile pic (imageUpdated === true), the previous image should be removed from Cloudinary.
      // A new image property should be created if a new image exists, otherwise a blank property is used to overwrite the existing image data
      // Booleans cannot be set in form data object, so check for string version of boolean
      if (req.body.imageUpdated === 'true') {
        // cloudinary.uploader.destroy(post.image.imageId);
        if (req.file) {
          user.profilePic = {
            imageId: req.file.filename,
            imageUrl: req.file.path,
          }
        } else {
          user.profilePic = undefined;
        }
      }

      await user.save();
 
      res.status(200).json(user);   // Return status OK and updated user to client
    }
  }),
];


// @desc    Delete single user
// @route   DELETE /api/user/:userId
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
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
  }); // Might consider returning the deleted user itself here?
});


// @desc    Get all posts by a single user
// @route   GET /api/user/:userId/posts
// @access  Private
const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ 'user': req.params.userId })
  .populate('user', 'firstName lastName profilePic')
  .populate('comments')
  res.status(200).json(posts)
});

// @desc    Get all posts making up a user's feed, sorted by date recency (consider limiting to past X months only)
// @route   GET /api/user/:userId/feed
// @access  Private
const getUserFeed = asyncHandler(async (req, res) => {
  // Use the virtual 'posts' for each user in the friends list. This will create a combined list of all friends' posts
  // Retrieve single user by user ID, retrieving only friends list (but full populated data)
  const user = await User.findById(req.params.userId, 'friends')
    .populate({
      path: 'posts',
      populate: { path: 'user', select: 'firstName lastName profilePic' }, 
    })
    .populate({
      path: 'posts',
      populate: { path: 'comments' }
    })
    .populate({
      path: 'friends',
      populate: { 
        path: 'user', 
        // select: 'firstName lastName profilePic', 
        populate: { 
          path: 'posts',
          populate: { path: 'user', select: 'firstName lastName profilePic' } 
        }
      },
    });

  if (!user) {  // user not found in db, above query returns null
    res.status(400);
    throw new Error('User not found');
  }

  // Convert user doc to JS object to reveal virtuals (not revealed until doc is cast into Object or JSON)
  const userObj = user.toObject();
  // console.log(userObj.friends);

  // Extract array of user's own posts to later include in the feed
  const userPosts = userObj.posts;

  // Multi-step array operation: create new array with each friend mapped to their own array of posts, then flatten this new array to remove nesting and empty arrays (friends that had no posts map to empty arrays). The result is a single-depth array of posts only, representing all posts from a user's friends
  const friendPosts = (userObj.friends.map((friend) => (friend.user.posts))).flat();
  

  // Combine friend posts with user's posts for the overall feed (unsorted)
  const postFeed = userPosts.concat(friendPosts);

  // Sort the feed by date posted using native JS date comparisons
  const sortedFeed = postFeed.sort((a, b) => {
    return (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0);
  });
  
  res.status(200).json(sortedFeed);
});

// @desc    Get all friends/friend requests of a user sorted by request status
// @route   GET /api/user/:userId/friends
// @access  Private
const getUserFriends = asyncHandler(async (req, res) => {
  // Retrieve single user by user ID, retrieving only friends list (but full populated data) and virtuals for different types of friend requests
  const user = await User.findById(req.params.userId, 'friends')
    .populate({
      path: 'friends',
      populate: { path: 'user', select: 'firstName lastName profilePic' },
    })

  if (!user) {  // user not found in db, above query returns null
    res.status(400);
    throw new Error('User not found');
  }

  // Take the raw friends array and sort into individual groups based on friendEntry status.
  // It is possible to delegate this to frontend users or backend server. Because of the small scale of this app, the choice is trivial, but has been considered none the less.
  const sortedFriends = {
    acceptedFriends: user.friends.filter((friendEntry) => friendEntry.status === 'friend'),
    incomingRequests: user.friends.filter((friendEntry) => friendEntry.status === 'incomingRequest'),
    outgoingRequests: user.friends.filter((friendEntry) => friendEntry.status === 'outgoingRequest'),
  }

  res.status(200).json(sortedFriends)
});


module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  updateUserPic,
  logoutUser,
  getCurrentUser,
  getUserPosts,
  getUserFeed,
  getUserFriends
}