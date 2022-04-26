const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getUserFeed } = require('../controllers/userController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/:userId', getUserFeed);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// UserID for 'Peter Parker' - sourced from the dbSetupTeardown.js file
const userId = '4c8a331bda76c559ef000004';

describe('getUser controller', () => {
  it("retrieves all of the user's own posts and friends posts", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // There are three own posts, and one post by each of two friends to give 5 total
    expect(res.body.length).toBe(5);
  });

  it("sorts returned posts by created date (most recent first)", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // Confirm all 5 posts are in date order
    expect(res.body[0].datePosted).toBe('December 20, 2021');
    expect(res.body[1].datePosted).toBe('April 20, 2021');
    expect(res.body[2].datePosted).toBe('March 20, 2021');
    expect(res.body[3].datePosted).toBe('December 2, 2020');
    expect(res.body[4].datePosted).toBe('July 20, 2020');
  });

  it("does not include non-friend posts", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);

    // Filter out any posts by user 'Norman Osborn', a non-friend
    const authors = res.body.filter((post) => post.user.firstName === 'Norman')

    expect(authors.length).toBe(0);

  });
});

