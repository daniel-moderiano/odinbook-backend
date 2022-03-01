require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

// Inbuilt express body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ message: "Hello World!" })
})

// Server will look for env variable PORT; if not available, will default to 3000
app.listen(port, () => console.log(`Server running on port ${port}`));


