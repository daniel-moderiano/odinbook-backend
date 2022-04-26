// Define all app-related functionality here, including use of middleware and routes. Do not call server listen func here.
require('dotenv').config();
const express = require('express');
const path = require('path');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');
const cors = require('cors')
const { errorHandler } = require('./middleware/errorMiddleware');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const compression = require('compression');
const app = express();

// Allow requests from any frontend domain specifically. Credientials must be true to allow cookies. Should only be needed for development!
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
}

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
  saveUninitialized: false,
  cookie: {   // cannot set security options in development as localhost runs on http only
    secure: process.env.NODE_ENV === 'development' ? false : true, 
    httpOnly: process.env.NODE_ENV === 'development' ? false : true,
    // sameSite: process.env.NODE_ENV === 'development' ? false : true,
    maxAge: 24 * 60 * 60 * 1000 * 7   // 7 days
  }
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
    res.redirect(process.env.HOST_URL);
});

// Use routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);

// Serve frontend from same server as backend
if (process.env.NODE_ENV === 'production') {
  // Set the static folder to the React build folder in frontend
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve the React html file for any non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'));
  })
} else {
  // A user-friendly message if trying to access homepage while in dev mode
  app.get("/", (req, res) => {
    res.send('API running in development mode')
  });
}

// Use error handler AFTER all routes are defined above
app.use(errorHandler);

// Export app for use in other modules mainly to make testing easier
module.exports = app;
