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

const users = [
  {
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'peter@gmail.com',
    password: '$2a$10$gARuP4KVU.uD0JmMzZ1Ox.cz.ZjshoDvd0DzIzHwU/tU7YqS.PHGO', 
    friends: [],
    _id: peterId,
  },
  {
    firstName: 'Harry',
    lastName: 'Osborn',
    email: 'harry@gmail.com',
    password: 'test123', 
    friends: [],
    _id: harryId,
  },
];

const posts = [
  {
    "user": "4c8a331bda76c559ef000004",
    "text": "Pizza time! Was a little bit late though, hope my boss gives me a pass...",
    "likes": [],
    "comments": [],
    "createdAt": "2020-12-02T09:32:49.309Z",
    "updatedAt": "2022-04-19T02:31:49.436Z",
    "image": {
      "imageId": "odinbook/lbpfperzhtpdni5ydhbt",
      "imageUrl": "https://res.cloudinary.com/dy2ycpgo4/image/upload/v1650335507/odinbook/lbpfperzhtpdni5ydhbt.jpg",
      "altText": "Tobey Maguire holding a stack of boxes"
    }
  },
  {
    "user": "4c8a331bda76c559ef000004",
    "text": "Just joined odinbook!",
    "likes": [],
    "comments": [],
    "createdAt": "2020-07-20T12:38:54.295Z",
    "updatedAt": "2022-04-19T02:31:49.436Z",
  },
  {
    "user": "4c8a331bda76c559ef000004",
    "text": "Managed to get a new job at the Daily Bugle!",
    "likes": [],
    "comments": [],
    "createdAt": "2021-03-20T12:38:54.295Z",
    "updatedAt": "2022-04-19T02:31:49.436Z",
  },
  {
    "user": "4c8a331bda76c559ef000005",
    "text": "I'm ruined. All I have left is Spider-Man.",
    "likes": [],
    "comments": [],
    "createdAt": "2021-04-20T12:38:54.295Z",
    "updatedAt": "2022-04-19T02:31:49.436Z",
  }
];

// IIFE to populate databse with initial data
(async () => {
  User.insertMany(users, (err, docs) => {
    if (err) { console.log(err); }
  });

  Post.insertMany(posts, (err, docs) => {
    if (err) { console.log(err) };
  })
})();
