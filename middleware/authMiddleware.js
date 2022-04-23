const asyncHandler = require('express-async-handler');

// Checks if there is a currently logged in (authenticated) user. Use on any private/restricted API routes
const protectRoute = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {   // passport-provided method, basically checks for req.user
    res.status(401);
    throw new Error('Not authorised, please log in.');
  }
  // User is logged in
  next();
});

module.exports = { protectRoute }