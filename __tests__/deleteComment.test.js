const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { deleteComment } = require('../controllers/commentController');
const Post = require('../models/PostModel');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.delete('/posts/:postId/comments/:commentId', deleteComment);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// Post ID for post by Norman Osborn, and comment by Peter
const postId = '4c8a331bda76c559ef000010';
const commentId = "4c8a331bda76c559ef000011";

describe('deleteComment controller', () => {
  it("returns deleted comment ID successful delete operation", async () => {
    const res = await request(app).delete(`/posts/${postId}/comments/${commentId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toBe(commentId);
  });

  it("removes comment reference from associated post", async () => {
    // Find post that originally had the deleted comment
    const post = await Post.findById(postId);

    // The post begins with two comments pre-deletion, and should end with one
    expect(post.comments.length).toBe(1);
  });
});