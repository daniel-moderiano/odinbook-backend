// Define all app-related functionality here, incluyding use of middleware and routes. Do not call server listen func here.
const express = require('express');
const postRoutes = require('./routes/postRoutes');
const app = express();
const cors = require('cors');

// Allow requests from any origin via CORS (limit with additional options as needed)
app.use(cors())

// Inbuilt express body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use('/api/posts', postRoutes);

// Export app for use in other modules mainly to make testing easier
module.exports = app;
