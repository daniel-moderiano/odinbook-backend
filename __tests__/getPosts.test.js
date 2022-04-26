const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getAllPosts } = require ('../controllers/postController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/posts', getAllPosts);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

describe('getComments controller', () => {
  it("returns all of the posts is json format", async () => {
    const res = await request(app).get('/posts');
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // There are six comments total in the db
    expect(res.body.length).toBe(6);
  });
});

