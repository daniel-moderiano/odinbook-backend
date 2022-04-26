const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { deletePost } = require('../controllers/postController');
const Post = require('../models/PostModel');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.delete('/posts/:postId', deletePost);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// Post ID for post by Norman Osborn, and comment by Peter
const postId = '4c8a331bda76c559ef000010';

describe('deleteComment controller', () => {
  it("returns deleted post on successful delete operation", async () => {
    const res = await request(app).delete(`/posts/${postId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toBe(postId);
  });
});