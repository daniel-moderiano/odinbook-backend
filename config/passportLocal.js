const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const asyncHandler = require('express-async-handler');
require('dotenv').config();

// Define custom username/password fields for passport to fetch username/password from
const customFields = {
  usernameField: 'email',
}

const verifyCallback = async (username, password, done) => {
  // Check for existing user in db, and if found, return only name and email
  // Add collation with strength 2 to perform case-insensitive search
  const user = await User.findOne({ email: username }).collation({ locale: 'en', strength: 2 });

  if (!user) {  // User does not exist in db
    return done(null, false, { message: 'User not found' })
  }

  // User exists in db, check passwords
  bcrypt.compare(password, user.password, (err, res) => {
    if (res) {
      // Passwords match, user is verified, credentials are valid. User object is returned
      return done(null, user);
    } else {
      // passwords do not match
      return done(null, false, { message: 'Invalid credentials' })
    }
  });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Only return basic user doc info
passport.deserializeUser((id, done) => {
  User.findById(id, {
    'firstName': 1, 
    'lastName': 1, 
    'email': 1,  
  }, (err, user) => {
    done(err, user);
  });
});