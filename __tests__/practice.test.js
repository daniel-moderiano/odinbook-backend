const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { initialiseMongoServer } = require('./dbConfig');
// const app = require('../app');
const express = require('express')
const { getUser } = require('../controllers/userController');
const app = express();
const User = require('../models/UserModel');
const mongoose = require('mongoose');

const db = initialiseMongoServer();

beforeAll(async () => {
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
});

// Use the controller
app.get('/:userId', getUser);

test("test getUser controller", done => {
  request(app)
    .get("/4c8a331bda76c559ef000004")
    // .expect("Content-Type", /json/)
    // .expect({ msg: 'done' })
    .expect(200, done);
  // const res = await request(app).get('/');
  // console.log(res );
});