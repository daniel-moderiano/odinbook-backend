const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const app = require('../app');

// Import db setup and teardown functionality
require('./dbSetupTeardown');

describe('loginUser controller', () => {
  it("returns user object after successfull login", async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'peter@gmail.com', password: 'peterparker' });

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.firstName).toBe('Peter');
  });

  it("does not expose password in user object after successfull login", async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'peter@gmail.com', password: 'peterparker' });

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.password).toBe(undefined);
  });

  it("validates for missing password field", async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'peter@gmail.com' });

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(400);
    // Should return array of validation errors
    expect(res.body[0].msg).toBe('Password is required');
  });
});

