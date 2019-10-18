require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Environment variable for port
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})