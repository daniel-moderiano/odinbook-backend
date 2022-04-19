// File specifically to create the server on specified port.
require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');

// Connect to MongoDB. Done here to avoid calling in test suites when app is imported.
connectDB();

// Server will look for env variable PORT; if not available, will default to 3000
app.listen(port, () => console.log(`Server running on port ${port}`);