const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { getUserFriends } = require('../controllers/userController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.get('/:userId', getUserFriends);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// UserID for 'Peter Parker' - sourced from the dbSetupTeardown.js file
const userId = '4c8a331bda76c559ef000004';

describe('getUserFriends controller', () => {
  it("returns object containing all four different friend request types", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.hasOwnProperty('acceptedFriends')).toBe(true);
    expect(res.body.hasOwnProperty('incomingRequests')).toBe(true);
    expect(res.body.hasOwnProperty('outgoingRequests')).toBe(true);
    expect(res.body.hasOwnProperty('deletedRequests')).toBe(true);
  });

  it("populates friend request data with basic information", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // Presence of fullName property indicates data has been populated
    expect(res.body.acceptedFriends[0].user.fullName).toBe('Harry Osborn');

  });

  it("correctly filters accepted friends", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // User should have a single accepted friend Harry
    expect(res.body.acceptedFriends[0].user.firstName).toBe('Harry');
  });

  it("correctly filters incoming requests", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // User should have a single incoming request from Norman
    expect(res.body.incomingRequests[0].user.firstName).toBe('Norman');
  });

  it("correctly filters outgoing requests", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // User should have a single outgoing request to Gwen
    expect(res.body.outgoingRequests[0].user.firstName).toBe('Gwen');
  });

  it("correctly filters deleted requests", async () => {
    const res = await request(app).get(`/${userId}`);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    // User should have a single deleted request from Eddie
    expect(res.body.deletedRequests[0].user.firstName).toBe('Eddie');
  });
});

