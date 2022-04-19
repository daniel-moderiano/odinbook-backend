// Define all app-related functionality here, including use of middleware and routes. Do not call server listen func here.
require('dotenv').config();
const express = require('express');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const compression = require('compression');
const helmet = require('helmet');
const app = express();

// Set basic security HTTP headers. Initial testing suggests the CSP does not block any key app features
app.use(helmet());

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

// PASSPORT SETUP
require('./config/passportFB');
require('./config/passportLocal');
app.use(passport.initialize());
app.use(passport.session());

// Compress all routes
app.use(compression())

// Initial FB auth occurs at this route. The FB auth page will be rendered. Must add email to scope as this requires additional permissions from the user
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// User hits this route upon successful FB authentication at above route.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook'),
  function(req, res) {
    // Successful authentication, redirect to frontend client URL.
    res.redirect(process.env.CLIENT_URL);
});

// Use routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);

// Use error handler AFTER all routes are defined above
app.use(errorHandler);

// Export app for use in other modules mainly to make testing easier
module.exports = app;
