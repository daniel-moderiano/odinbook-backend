const app = require('../app');
const request = require('supertest');
const db = require('./db');

// Setup connection to the database
beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

// Early iteration of tests to check that responses are being sent successfully
// TODO update tests to with/without authentication token with error/success responses
describe('Test API requests to routes concerning user comments under specific posts', () => {
  // Testing 'getPosts' behaviour
  test('Successful GET req for all comments returns correct status 200 and JSON data', done => {
    request(app).get('/api/posts/anyPostId/comments')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });

  // Testing 'getPost' behaviour
  test('Successful GET req for single comment returns correct status 200 and JSON data', done => {
    request(app).get('/api/posts/anyPostId/comments/anyCommentId')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });

  // Testing 'addPost' behaviour
  test('Successful POST req for adding comment returns correct status 200 and JSON data', done => {
    request(app).post('/api/posts/anyPostId/comments')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });

  // Testing 'updatePost' behaviour
  test('Successful PUT req for updating comment returns correct status 200 and JSON data', done => {
    request(app).put('/api/posts/anyPostId/comments/anyCommentId')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });

  // Testing 'likePost' behaviour
  test('Successful PUT req for liking comment returns correct status 200 and JSON data', done => {
    request(app).put('/api/posts/anyPostId/comments/anyCommentId/likes')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });

  // Testing 'deletePost' behaviour
  test('Successful DELETE req for single comment returns correct status 200 and JSON data', done => {
    request(app).delete('/api/posts/anyPostId/comments/anyCommentId')
    .expect("Content-Type", /json/)
    .expect(200, done)
  });
});

