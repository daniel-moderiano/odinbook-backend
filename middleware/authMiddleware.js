const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // Check that a necessary auth header exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (header always in the form Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user ID from token payload, and asign user to req object
      req.user = await User.findById(decoded.id, { 'password': 0 });
      next();
    } catch (error) {
      res.status(401)   // Unauthorised status
      throw new Error('Credentials not valid, please log in.')
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorised, please log in.');
  }
});

module.exports = { protectRoute }