const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const request = require('supertest');
const { deleteUserAccount } = require('../controllers/userController');
const express = require('express');

// Setup new app instance
const app = express();

// Use the controller
app.delete('/user/:userId/account', deleteUserAccount);

// Import db setup and teardown functionality
require('./dbSetupTeardown');

// Post ID for post by Norman Osborn, and comment by Peter
const userId = '4c8a331bda76c559ef000004';
const testId = '6253eafa7c5f03b0906cc7b5';

describe('deleteAccount functionality', () => {
  it("prevents user from deleting test account", async () => {
    const res = await request(app).delete(`/user/${testId}/account`);
    expect(res.statusCode).toEqual(400);
    expect((/cannot delete test account/i).test(res.text)).toBe(true);
  });
});