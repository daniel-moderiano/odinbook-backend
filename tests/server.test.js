const express = require("express");
const request = require('supertest');

// Define app here, but do not need to actually listen on a port. Supertest will handle this.
const app = express();

// Use route modules in combination with app.use for testing certain routes
// app.use("/", exampleRouter);

// test("index route works", done => {
//   request(server)
//     .get("/")
//     .expect("Content-Type", /json/)
//     .expect({ message: "Hello World!" })
//     .expect(200, done);
// });

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
