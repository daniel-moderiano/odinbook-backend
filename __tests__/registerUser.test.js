const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const User = require('../models/UserModel');
const app = require('../app');

// Import db setup and teardown functionality
require('./dbSetupTeardown');

describe('registerUser controller', () => {
  it("returns user object after successfull user sign up/register (with password hidden)", async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstName: 'Norman',
        lastName: 'Osborn', 
        email: 'norman@gmail.com', 
        password: 'test123',
        confirmPassword: 'test123'
      });
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.firstName).toBe('Norman');

    // Check password is not exposed
    expect(res.body.user.password).toBe(undefined);
  });

  it("creates new user in db upon registering successfully", async () => {
    const user = await User.findOne({ firstName: 'Norman' });
    expect(user.firstName).toBe('Norman');
  });
});

