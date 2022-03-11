const asyncHandler = require('express-async-handler');

// Simple middleware to check for req.user property, which is set on every request for those users with valid credentials that are currently logged in
const protectRoute = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorised, please log in.');
  }

  // User logged in
  next();
});

module.exports = { protectRoute }