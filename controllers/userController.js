const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { body, validationResult } = require("express-validator");
const upload = require('../config/multer');
const cloudinary = require('cloudinary').v2;
const config = require('../config/cloudinary');

// Note req.params.id of any kind is cast to ObjectID before a search query is run. Therefore, injection attacks do not have a foothold here (error will be thrown regardless).

// @desc    Get a user (public details)
// @route   GET /api/users/:userId
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  // Retrieve single user by user ID, retrieving only public details (no password)
  const user = await User.findById(req.params.userId, '-password');

  if (!user) {  // user not found in db, above query returns null
    res.status(400);
    throw new Error('User not found');
  }
  res.status(200).json(user)
});

// @desc    Get all users (public details)
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, 'firstName lastName profilePic');
  res.status(200).json(users)
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
        throw new Error('Email already taken')
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

      await newUser.save();
      // Attach user ID to current session to ensure user can be identified on subsequent requests
      req.session.userId = newUser._id;

      res.status(200).json({
        _id: newUser._id,
        username: newUser.email,
      });   // Return status OK and new post to client
    }
  }),
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
    } else {
      // Form data valid. Check for user in db and compare pw
      const user = await User.findOne({ email: req.body.email });

      if (user && (await bcrypt.compare(req.body.password, user.password))) { 
        // Attach user ID to current session to ensure user can be identified on subsequent requests
        req.session.userId = user._id;

        // User in db and passwords match. Return user to client
        res.status(200).json({
          _id: user._id,
          username: user.email,
        });  
      } else {  // user not found in db OR passwords do not match. Can split this logic for specific errors if needed
        res.status(400);
        throw new Error('Invalid credentials');
      }
    }
  }),
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
  req.session.destroy();
  res.status(200).json({  // Return status OK and logout message
    message: 'Log out successful'
  });   
});

// @desc    Update user details
// @route   PUT /api/users
// @access  Private
const updateUser = [
  // Upload any profile picture added
  upload.single('image'),
  
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

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Validation errors have occurred. Return these to the user
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());   // Do not throw single error here, pass all validation errors
    } else {
      // Submitted data is valid
      // Check if user exists in db
      const user = await User.findById(req.params.userId);

      if (!user) {  // comment not found in db
        res.status(400);
        throw new Error('User not found');
      }

      // Update user in db
      const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        profilePic: req.file && {
          imageId: req.file.filename,
          imageUrl: req.file.path,
        },
        bio: {
          location: req.body.location ? req.body.location : undefined,
          occupation: req.body.occupation ? req.body.occupation : undefined,
          education: req.body.education ? req.body.education : undefined,
          gender: req.body.gender ? req.body.gender : undefined
        },
      }, { 
        new: true,
        projection: {   // do not return password to client
          password: 0,
        } 
      });  // { new: true } ensures the updated user is returned
      res.status(200).json(updatedUser);   // Return status OK and updated user to client (select details only)
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
  res.status(200).json({ id: req.params.userId }); // Might consider returning the deleted user itself here?
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  logoutUser
}