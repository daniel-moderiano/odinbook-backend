const User = require('../models/UserModel');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const asyncHandler = require('express-async-handler');
require('dotenv').config();

// Essentially a config object for the FB passport strategy that links it with the Odinbook (ob) app on Facebook Developers
const strategyOptions = {
  clientID: process.env['FACEBOOK_APP_ID'],
  clientSecret: process.env['FACEBOOK_APP_SECRET'],
  // When the user is successfully authenticated via the FB login, they will be redirected to this IRL
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'name', 'email']
}

const verifyCallback = asyncHandler(async (accessToken, refreshToken, profile, done) => {
  // Check for existing user in db
  const user = await User.findOne({ facebookId: profile.id });

  if (user) {   // user has logged into this app with FB before. Link with their account and log in
    return done(null, user);
  } else {    // user has not logged into this app with FB before. Create a new account using their FB details
    const newUser = new User({
      facebookId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      friends: [],
    });

    // Save new user account and pass to callback function to move to next middleware
    await newUser.save();
    return done(null, newUser);
  }
});

const strategy = new FacebookStrategy(strategyOptions, verifyCallback);

passport.use(strategy);

// Required functions for the passport middleware. Customised slightly to use user._id rather than entire user object for better data safety/best pracice
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });