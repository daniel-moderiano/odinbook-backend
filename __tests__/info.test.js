// Informational test file only

// Import app as a whole for more end-to-end based testing of API routes. Alternatively a new barebones express app can be created within test modules to better focus on unit-style testing.
const app = require('../app');
const request = require('supertest');

// Testing routes using 'done' syntax. Test for general successful JSON response only
test("GET req returns success response with JSON data", done => {
  request(app)
    .get("/api/posts")
    .expect("Content-Type", /json/)
    .expect(200, done);
});

// Testing routes using 'done' syntax. Test for general successful JSON response only
test("GET posts returns success response with JSON data", async () => {
  const res = await request(app).get("/api/posts");
  expect(res.headers['content-type']).toMatch(/json/)
  expect(res.statusCode).toEqual(200);
});

// Demonstrates modifying response to get exact data matching. If expecting a specific JSON key, you can check the res body for that key, and set it to an arbitrary value for comparison. If the key isn't present, i.e. the wrong data format is returned in response, then the test fails
test("GET req returns success response with JSON data", done => {
  request(app)
    .get("/api/posts")
    .expect("Content-Type", /json/)
    .expect((res) => {
      if(res.body.message) {
        res.body.message = "Message returned"
      }
    })
    .expect({ message: "Message returned" })
    .expect(200, done);
});

// To test res.body or other parameters more easily, use the async/await syntax as follows
// Testing 'getPost' behaviour
test('Successful GET req for single post returns correct status and data (single JSON post returned)', async () => {
  const response = await request(app).get('/api/posts/1234');
  expect(response.header['content-type']).toMatch(/json/);
  expect(Object.keys(response.body).length).toBe(1);
  expect(response.status).toBe(200);
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
