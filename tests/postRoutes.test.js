// Import app as a whole for more end-to-end based testing of API routes. Alternatively a new barebones express app can be created within test modules to better focus on unit-style testing.
const app = require('../app');
const request = require('supertest');


test("GET posts returns success response with JSON data", done => {
  request(app)
    .get("/api/posts")
    .expect("Content-Type", /json/)
    // .expect({ message: "Hello World!" })
    .expect(200, done);
});

// test("testing route works", done => {
//   request(app)
//     .post("/test")
//     .type("form")
//     .send({ item: "hey" })
//     .then(() => {
//       request(app)
//         .get("/test")
//         .expect({ array: ["hey"] }, done);
//     });
// });
