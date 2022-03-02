const asyncHandler = require('express-async-handler');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ user: 'User data' })
});


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