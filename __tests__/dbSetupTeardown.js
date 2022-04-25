const { db } = require('./db');

// Standard database setup and teardown
beforeAll(() => db.initialiseMongoServer());
// afterEach(() => db.clearMongoServer());   // may or may not be required when testing individual controllers
afterAll(() => db.stopMongoServer());
