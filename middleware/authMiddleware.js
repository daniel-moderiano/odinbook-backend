const asyncHandler = require('express-async-handler');

const protectRoute = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401);
    throw new Error('Not authorised, please log in.');
  }
  // User logged in
  next();
});

module.exports = { protectRoute }