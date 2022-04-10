// Define all app-related functionality here, including use of middleware and routes. Do not call server listen func here.
require('dotenv').config();
const express = require('express');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');
const app = express();
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { addUserToRequestObject } = require('./middleware/userMiddleware');
const passport = require('passport');

// Allow requests from any frontend domain specifically. Credientials must be true to allow cookies
app.use(cors({
  origin: 'http://localhost:3006',
  credentials: true
}));

// Inbuilt express body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up session store (session data will be stored on MongoDB). Note a new connection is created to mongo here. This could be reconfigured to use an existing connection if necessary
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions'
});

// Use session middleware to cryptographically sign and set coookies. This will connect to the mongoDB session storage collection to save session info
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
}));



// PASSPORT 
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Perform authentication when the user hits this route
// Must scope email as this requires additional permissions from the user
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Present a message when the user successfully authenticates with FB
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    console.log(req.session, req.user);
    // Successful authentication, redirect to frontend client URL.
    res.redirect('http://localhost:3006');
  });

// This is a local app logout; it does not log the user out of facebook itself
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

// Make available req.user on all requests when a user is currently logged in
app.use(addUserToRequestObject);

// Use routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);

// Use error handler AFTER all routes are defined above
app.use(errorHandler);

// Export app for use in other modules mainly to make testing easier
module.exports = app;
