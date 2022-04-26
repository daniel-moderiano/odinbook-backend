const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getComments } = require('../controllers/commentController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/posts/:postId/comments', getComments);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// Post ID for post by Norman Osborn
const postId = '4c8a331bda76c559ef000010';

describe('getComments controller', () => {
  it("retrieves all of the post's comments", async () => {
    const res = await request(app).get(`/posts/${postId}/comments`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // There are two comments on this post
    expect(res.body.length).toBe(2);
  });

  it("populates correct user data for each comment", async () => {
    const res = await request(app).get(`/posts/${postId}/comments`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // First comment is by Peter Parker
    expect(res.body[0].user.fullName).toBe('Peter Parker');
  });

  it("performs nested populate on comment likes correctly", async () => {
    const res = await request(app).get(`/posts/${postId}/comments`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // First comment is by Peter Parker, liked by Harry
    expect(res.body[0].likes[0].fullName).toBe('Harry Osborn');
  });
});

