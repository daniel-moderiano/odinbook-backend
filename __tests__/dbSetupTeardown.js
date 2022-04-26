const { db } = require('./db');
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const mongoose = require('mongoose');

// Standard database setup and teardown. Do not clear between each test, as state is often required to persist between tests
beforeAll(() => db.initialiseMongoServer());
afterAll(async () => {    // shut down in between test suites
  await db.clearMongoServer();
  await db.stopMongoServer();
});

// Explicitly define IDs here to make it easier to understand relationships in test db
const peterId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000004");
const harryId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000005");
const normanId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000006");
const gwenId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000007");
const eddieId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000008");
const mjId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000009");

const normanPostId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000010");

const peterCommentId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000011");
const harryCommentId = new mongoose.Types.ObjectId("4c8a331bda76c559ef000012");

// Set up array of user/post/comment docs to be later saved to db
const users = [
  {
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'peter@gmail.com',
    password: '$2a$10$gARuP4KVU.uD0JmMzZ1Ox.cz.ZjshoDvd0DzIzHwU/tU7YqS.PHGO', 
    friends: [
      {
        "user": "4c8a331bda76c559ef000005",
        "status": "friend",
      },
      {
        "user": "4c8a331bda76c559ef000006",
        "status": "incomingRequest",
      },
      {
        "user": "4c8a331bda76c559ef000007",
        "status": "outgoingRequest",
      },
      {
        "user": "4c8a331bda76c559ef000008",
        "status": "deletedRequest",
      },
      {
        "user": "4c8a331bda76c559ef000009",
        "status": "friend",
      },
    ],
    _id: peterId,
  },
  {
    firstName: 'Harry',
    lastName: 'Osborn',
    email: 'harry@gmail.com',
    password: 'test123', 
    friends: [
      {
        "user": "4c8a331bda76c559ef000004",
        "status": "friend",
      },
            {
        "user": "4c8a331bda76c559ef000006",
        "status": "friend",
      },
    ],
    _id: harryId,
  },
  {
    firstName: 'Norman',
    lastName: 'Osborn',
    email: 'norman@gmail.com',
    password: 'test123', 
    friends: [
      {
        "user": "4c8a331bda76c559ef000005",
        "status": "friend",
      },
      {
        "user": "4c8a331bda76c559ef000004",
        "status": "outgoingRequest",
      },
    ],
    _id: normanId,
  },
  {
    firstName: 'Gwen',
    lastName: 'Stacey',
    email: 'gwen@gmail.com',
    password: 'test123', 
    friends: [
      {
        "user": "4c8a331bda76c559ef000004",
        "status": "incomingRequest",
      },
    ],
    _id: gwenId,
  },
  {
    firstName: 'Eddie',
    lastName: 'Brock',
    email: 'eddie@gmail.com',
    password: 'test123', 
    friends: [],
    _id: eddieId,
  },
  {
    firstName: 'Mary Jane',
    lastName: 'Watson',
    email: 'mj@gmail.com',
    password: 'test123', 
    friends: [
      {
        "user": "4c8a331bda76c559ef000004",
        "status": "friend",
      },
    ],
    _id: mjId,
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
  },
  {
    "user": "4c8a331bda76c559ef000009",
    "text": "Hello it's me, MJ!",
    "likes": [],
    "comments": [
      "6254108b9302b7824770eb68"
    ],
    "createdAt": "2021-12-20T12:38:54.295Z",
    "updatedAt": "2022-04-19T02:31:49.436Z",
  },
  {   // the main test post here with regards to likes and comments. Note that inserting the userID variables into likes array does NOT work!
    "_id": normanPostId,
    "user": "4c8a331bda76c559ef000006",
    "text": "You can't do this to me!",
    "likes": [
      '4c8a331bda76c559ef000004',
      '4c8a331bda76c559ef000005'
    ],
    "comments": [
      peterCommentId,
      harryCommentId
    ],
    "createdAt": "2021-06-20T12:38:54.295Z",
    "updatedAt": "2022-04-19T02:31:49.436Z",
  }
];

const comments = [
  {   // Peter comments on Norman's post, liked by Harry and Norman
    "_id": peterCommentId,
    "user": "4c8a331bda76c559ef000004",
    "text": "It's a jungle out there",
    "likes": [
      "4c8a331bda76c559ef000005",
      "4c8a331bda76c559ef000006"
    ],
    "createdAt": "2020-12-03T10:35:02.373Z",
  },
  {   // Harry comments on Norman's post, liked by MJ and Peter
    "_id": harryCommentId,
    "user": "4c8a331bda76c559ef000005",
    "text": "You'll bounce back Dad",
    "likes": [
      "4c8a331bda76c559ef000004",
      "4c8a331bda76c559ef000009"
    ],
    "createdAt": "2020-12-03T10:35:02.373Z",
  },
  {   // Peter comments on MJ's post, liked by MJ
    "_id": "6254108b9302b7824770eb68",
    "user": "4c8a331bda76c559ef000004",
    "text": "Hi MJ!",
    "likes": [
      "4c8a331bda76c559ef000009"
    ],
    "createdAt": "2020-12-03T10:35:02.373Z",
  }
];

// IIFE to populate databse with initial data. Use insertMany to reduce overall db calls
(async () => {
  User.insertMany(users, (err, docs) => {
    if (err) { console.log(err); }
  });

  Post.insertMany(posts, (err, docs) => {
    if (err) { console.log(err) };
  });

  Comment.insertMany(comments, (err, docs) => {
    if (err) { console.log(err); }
  });
})();
