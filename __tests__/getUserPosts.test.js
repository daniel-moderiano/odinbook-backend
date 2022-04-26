const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getUserPosts } = require('../controllers/userController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/:userId', getUserPosts);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// UserID for 'Peter Parker' - sourced from the dbSetupTeardown.js file
const userId = '4c8a331bda76c559ef000004';

describe('getUser controller', () => {
  it("retrieves only those posts by the user specified", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // There are three (out of four) posts by this user in the db 
    expect(res.body.length).toBe(3);
  });

  it("sorts returned posts by created date (most recent first)", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
    // Confirm all 3 posts are in date order
    expect(res.body[0].datePosted).toBe('March 20, 2021');
    expect(res.body[1].datePosted).toBe('December 2, 2020');
    expect(res.body[2].datePosted).toBe('July 20, 2020');
  });
});

