const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getPost } = require('../controllers/postController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/posts/:postId', getPost);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// Post ID for post by Norman Osborn
const postId = '4c8a331bda76c559ef000010';

describe('getPost controller', () => {
  it("returns post with correctly populated 'likes' field'", async () => {
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // First like is from Peter
    expect(res.body.likes[0].fullName).toBe('Peter Parker');
  });
});