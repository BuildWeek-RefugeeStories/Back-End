require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const auth = require('./auth');

const app = express();

// Environment variable for port
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Use auth endpoint
app.use('/auth', auth);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})

module.exports = app;