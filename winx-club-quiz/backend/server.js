const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the PostgreSQL database');
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Winx Club Quiz App!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
