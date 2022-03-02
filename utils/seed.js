const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db')

// Connect to mongoDB
connectDB();

// Arrays to hold all fake data
const users = [];
const posts = [];
const comments = [];

const createUser = () => {
  return new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(), 
    friends: [],
    bio: { 
      location: faker.address.cityName(),
      occupation: faker.name.jobTitle(),
      education: faker.address.country(),
      gender: faker.name.gender(),  
    },
    profilePic: faker.image.avatar()
  });
};

// Create 20 users first, so that these may be referenced when creating comments and posts
for (let i = 0; i < 20; i++) {
  users.push(createUser());
};

// Create 20 posts next so that comments can then be pushed into posts
const createPost = () => {
  const randomNum = Math.floor(Math.random()*20);
  const randomCommentNum = Math.floor(Math.random()*20);
  return new Post({
    user: users[randomNum]._id,
    title: faker.lorem.words(),
    text: faker.lorem.paragraph(), 
    likes: [],
    comments: [],
    imageUrl: faker.image.imageUrl(),
  })
};

for (let i = 0; i < 20; i++) {
  posts.push(createPost());
};


const createComment = () => {
  const randomNum = Math.floor(Math.random()*20);

  return new Comment({
    user: users[randomNum]._id,
    text: faker.lorem.sentence(),
    likes: [],
  })
}

for (let i = 0; i < 20; i++) {
  const randomNum = Math.floor(Math.random()*20);
  const comment = createComment();
  comments.push(comment);
  // Add to particular post here to avoid dupe comments on multiple posts
  posts[randomNum].comments.push(comment);
};

const addToDB = () => {
  comments.forEach((user) => {
    user.save((err) => {
      if (err) { console.log(err) }
    })
  });
  
  users.forEach((user) => {
    user.save((err) => {
      if (err) { console.log(err) }
    })
  });
  
  posts.forEach((user) => {
    user.save((err) => {
      if (err) { console.log(err) }
    })
  });
};

// Call addToDB to add data
// addToDB();


