const app = require('../app');
const request = require('supertest');
const db = require('./db');

// Setup connection to the database
beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
// Leaving the following connection close func throws error for some unknown reason. Leave uncommented
// afterAll(async () => await db.close()); 

// Early iteration of tests to check that responses are being sent successfully
// TODO update tests to with/without authentication token with error/success responses
describe('Test API requests to routes concerning user authentication and data management', () => {
  // Testing 'registerUser' behaviour
  test('Successful POST req for registering user reponds with correct status 200 and JSON data', done => {
    request(app).post('/api/users/register')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });

  // Testing 'loginUser' behaviour
  test('Successful GET req for logging in user reponds with correct status 200 and JSON data', done => {
    request(app).post('/api/users/login')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });

  // Testing 'getMe' behaviour
  test('Successful POST req for fetching user data returns correct status 200 and JSON data', done => {
    request(app).get('/api/users/me')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });
});

