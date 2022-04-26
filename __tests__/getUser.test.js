const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getUser } = require('../controllers/userController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/:userId', getUser);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// UserID for 'Peter Parker' - sourced from the dbSetupTeardown.js file
const userId = '4c8a331bda76c559ef000004';

describe('getUser controller', () => {
  it("retrieves specified user by ID", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.firstName).toBe('Peter');
  });

  it("does not expose password in user object returned from db", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.password).toBe(undefined);
  });

  it("populates virtual 'fullName' property", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.fullName).toBe('Peter Parker');
  });

  it("throws 'user not found' error if ID does not exist in DB", async () => {
    const res = await request(app).get('/4c8a331bda76c559ef000000');
    expect(res.statusCode).toEqual(400);
    expect((/user not found/i).test(res.text)).toBe(true);
  });
});

