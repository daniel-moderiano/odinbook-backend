const { db } = require('./db');
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const mongoose = require('mongoose');

// Standard database setup and teardown
beforeAll(() => db.initialiseMongoServer());
// afterEach(() => db.clearMongoServer());   // may or may not be required when testing individual controllers
afterAll(() => db.stopMongoServer());

// IIFE to populate databse with initial data
(async () => {
  // Populate database initially
  const id = new mongoose.Types.ObjectId("4c8a331bda76c559ef000004")
  // Create new user with all required data
  const newUser = new User({
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'pete@gmail.com',
    password: 'test123', 
    friends: [],
    _id: id,
  });

  // Save user and pass on to authentication step to automatically log the user in
  await newUser.save();
})();
