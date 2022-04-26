const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getUsers } = require('../controllers/userController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/', getUsers);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

describe('getUsers controller', () => {
  it("retrieves all users in the db", async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.users.length).toBe(2);
  });

  it("does not expose password in user data returned from db", async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.users[0].password).toBe(undefined);
  });
})

