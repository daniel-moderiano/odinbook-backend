const User = require('../models/UserModel');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const generateAltText = require('../utils/altTextGenerator');

// Essentially a config object for the FB passport strategy that links it with the Odinbook (ob) app on Facebook Developers
const strategyOptions = {
  clientID: process.env['FACEBOOK_APP_ID'],
  clientSecret: process.env['FACEBOOK_APP_SECRET'],
  // When the user is successfully authenticated via the FB login, they will be redirected to this IRL
  callbackURL: `${process.env.HOST_URL}auth/facebook/callback`,
  profileFields: ['id', 'name', 'email', 'picture.type(large)']
}

const verifyCallback = asyncHandler(async (accessToken, refreshToken, profile, done) => {
  // Check for existing user in db
  const user = await User.findOne({ facebookId: profile.id });

  if (user) {   // user has logged into this app with FB before. Link with their account and log in
    return done(null, user);
  } else {    // user has not logged into this app with FB before.
    // Set altText variable as FB does not provide any with profile pic
    const altText = await generateAltText(profile.photos[0].value);

    // Create a new User doc with their FB details
    const newUser = new User({
      facebookId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      // Image will always be available. Is set to anon img if FB profile has not changed. No alt text available for these unfortunately
      profilePic: {   // only able to get imageURL, no altText available
        imageUrl: profile.photos[0].value,
        altText,
      },
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Only return basic user doc info
passport.deserializeUser((id, done) => {
  User.findById(id, {
    'firstName': 1, 
    'lastName': 1, 
    'email': 1,  
    'profilePic': 1
  }, (err, user) => {
    done(err, user);
  });
});