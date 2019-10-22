require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const auth = require('./auth');
const posts = require('./posts');

const app = express();

// Environment variable for port
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Use auth endpoint
app.use('/auth', auth);

// Use posts endpoint
app.use('/posts', posts);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('Connected to database!');
}) 

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})

module.exports = app;