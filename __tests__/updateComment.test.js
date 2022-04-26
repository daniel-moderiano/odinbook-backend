const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { updateComment } = require('../controllers/commentController');
const express = require('express');

// Setup new app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the controller
app.put('/posts/:postId/comments/:commentId', updateComment);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// Post ID for post by Norman Osborn
const postId = '4c8a331bda76c559ef000010';
const commentId = "4c8a331bda76c559ef000011";

describe('updateComment controller', () => {
  it("returns newly updated comment on successful update operation", async () => {
    const res = await request(app)
      .put(`/posts/${postId}/comments/${commentId}`)
      .send({ text: 'updated' });

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toBe('updated');
  });

  it("correctly updates comment text", async () => {
    const res = await request(app)
      .put(`/posts/${postId}/comments/${commentId}`)
      .send({ text: 'new text' });
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toBe('new text');
  });

  it("provides validation error if comment text is left blank", async () => {
    const res = await request(app)
      .put(`/posts/${postId}/comments/${commentId}`)
      .send({ text: '' });
    expect(res.statusCode).toEqual(400);
    expect((/comment text is required/i).test(res.text)).toBe(true)
  });
});