const { db } = require('./db');
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const mongoose = require('mongoose');

// Standard database setup and teardown
beforeAll(() => db.initialiseMongoServer());
// afterEach(() => db.clearMongoServer());   // may or may not be required when testing individual controllers
afterAll(async () => {
  await db.clearMongoServer();
  await db.stopMongoServer();
});

const peterId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000004");
const harryId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000005");

// IIFE to populate databse with initial data
(async () => {
  // Create new users with basic required data
  const peter = {
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'peter@gmail.com',
    password: '$2a$10$gARuP4KVU.uD0JmMzZ1Ox.cz.ZjshoDvd0DzIzHwU/tU7YqS.PHGO', 
    friends: [],
    _id: peterId,
  };

  const harry = {
    firstName: 'Harry',
    lastName: 'Osborn',
    email: 'harry@gmail.com',
    password: 'test123', 
    friends: [],
    _id: harryId,
  };

  // await peter.save();
  // await harry.save();
  User.insertMany([peter, harry], (err, docs) => {
    if (err) { console.log(err); }
  })
})();
