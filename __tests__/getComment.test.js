const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getComment } = require('../controllers/commentController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/posts/:postId/comments/:commentId', getComment);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// Post ID for post by Norman Osborn
const postId = '4c8a331bda76c559ef000010';
const commentId = "4c8a331bda76c559ef000011";

describe('getComment controller', () => {
  it("correctly populates nested like fields", async () => {
    const res = await request(app).get(`/posts/${postId}/comments/${commentId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // First like is from Harry
    expect(res.body.likes[0].fullName).toBe('Harry Osborn');
  });
});