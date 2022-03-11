const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

// Check incoming requests for existing sessions and userIDs, and if these exist, add user profile information to the request object
const addUserToRequestObject = asyncHandler(async (req, res, next) => {
  if (!(req.session && req.session.userId)) {
    // No session data exists
    return next();
  }

  // Session data exists. Find associated user but do not grab password field
  const user = await User.findById(req.session.userId, {
    'firstName': 1, 
    'lastName': 1, 
    'email': 1,  
  });

  if (!user) {
    // User somehow disconnected from session or deleted. 
    res.status(400);
    throw new Error('User not found');
  }

  // Add user information to request object
  req.user = user;
  next();
});

module.exports = { addUserToRequestObject }