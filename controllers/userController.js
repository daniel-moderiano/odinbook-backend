const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { body, validationResult } = require("express-validator");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
}

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = [
  // Validate fields
  body('firstName', 'First name is required').trim().isLength({ min: 1 }),
  body('lastName', 'Last name is required').trim().isLength({ min: 1 }),
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
        bio: {  // Basic information for profile page. All optional
          location: '',
          occupation: '',
          education: '',
          gender: ''  // Almost considered enums for a second...
        },
        profilePic: '',
      });
      console.log(newUser);

      // await newUser.save();
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
const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({ user: 'User data' })
});

// @desc    Get current user data (requires actively logged in user)
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ user: 'User data' })
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
}