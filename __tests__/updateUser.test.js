const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { updateUser } = require('../controllers/userController');
const express = require('express');

// Setup new app instance
// ! Do not forget body parsers, tests will all fail otherwise
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the controller
app.put('/:userId', updateUser);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// UserID for 'Peter Parker' - sourced from the dbSetupTeardown.js file
const userId = '4c8a331bda76c559ef000004';

describe('updateUser controller', () => {
  it("successfully updates basic user info (i.e. last name)", async () => {
    const res = await request(app)
      .put(`/${userId}`)
      .send({
        firstName: 'Peter',
        lastName: 'Porker', 
        email: 'peter@gmail.com', 
      });
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.lastName).toBe('Porker');
  });

  it("does not attempt to update bio information if none is provided", async () => {
    const res = await request(app)
    .put(`/${userId}`)
    .send({
      firstName: 'Peter',
      lastName: 'Parker', 
      email: 'peter@gmail.com', 
    });
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.bio).toBe(undefined);
  });

  it("adds new bio fields if provided in update request", async () => {
    const res = await request(app)
    .put(`/${userId}`)
    .send({
      firstName: 'Peter',
      lastName: 'Parker', 
      email: 'peter@gmail.com', 
      occupation: 'photographer'
    });
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.bio.occupation).toBe('photographer');
  });

  it("returns validation errors if user attempts to update without required fields", async () => {
    const res = await request(app)
    .put(`/${userId}`)
    .send({
      firstName: 'Peter',
      email: 'peter@gmail.com', 
      occupation: 'photographer'
    });
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(400);
    // Should return array of validation errors
    expect(res.body[0].msg).toBe('Last name is required');
  });

  it("provides helpful error is user attempts to change email to one already existing in db", async () => {
    const res = await request(app)
    .put(`/${userId}`)
    .send({
      firstName: 'Peter',
      lastName: 'Parker', 
      email: 'harry@gmail.com', 
      occupation: 'photographer'
    });
    expect(res.statusCode).toEqual(400);
    expect((/email is already in use/i).test(res.text)).toBe(true)
  });
});

