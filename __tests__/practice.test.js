const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getUser } = require('../controllers/userController');
const User = require('../models/UserModel');
const mongoose = require('mongoose');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/:userId', getUser);

// Express app and jest db env setup
require('./dbSetupTeardown');

describe('getUser functionality', () => {
  // Add pseudo user to db
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

  it("retrieves correct user data", async () => {
    const res = await request(app).get("/4c8a331bda76c559ef000004");
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.firstName).toBe('Peter');
  });
})

