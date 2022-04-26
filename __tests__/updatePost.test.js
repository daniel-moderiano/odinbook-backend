const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { updatePost } = require('../controllers/postController');
const express = require('express');

// Setup new app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the controller
app.put('/posts/:postId', updatePost);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// Post ID for post by Norman Osborn
const postId = '4c8a331bda76c559ef000010';

describe('updateComment controller', () => {
  it("returns newly updated post on successful update operation", async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .send({ text: 'updated' });

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toBe('updated');
  });

  it("correctly updates post text", async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .send({ text: 'new text' });
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toBe('new text');
  });

  it("provides validation error if post text is left blank", async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .send({ text: '' });
      console.log(res.body);
    expect(res.statusCode).toEqual(400);
    // Returns array of validation errors in case of missing post text
    expect(res.body[0].msg).toBe('Post text or image is required');
  });
});