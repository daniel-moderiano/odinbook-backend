const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { body, validationResult } = require("express-validator");
const upload = require('../config/multer');
const cloudinary = require('cloudinary').v2;
const config = require('../config/cloudinary');

// Note req.params.id of any kind is cast to ObjectID before a search query is run. Therefore, injection attacks do not have a foothold here (error will be thrown regardless).

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
}

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
      res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        token: generateToken(newUser._id),
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
        // User in db and passwords match. Return user and token to client
        res.status(200).json({
          _id: user._id,
          username: user.email,
          token: generateToken(user._id),
        });  
      } else {  // user not found in db OR passwords do not match. Can split this logic for specific errors if needed
        res.status(400);
        throw new Error('Invalid credentials');
      }
    }
  }),
];

// @desc    Update user details
// @route   PUT /api/users
// @access  Public
const updateUser = [
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
      res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        token: generateToken(newUser._id),
      });   // Return status OK and new post to client
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
  updateUser
}