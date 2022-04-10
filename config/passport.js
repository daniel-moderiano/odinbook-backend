const User = require('../models/UserModel');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const asyncHandler = require('express-async-handler');
require('dotenv').config();

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

    await newUser.save();
    return done(null, newUser);
  }
});

const strategy = new FacebookStrategy(strategyOptions, verifyCallback);

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});