const { Client } = require('pg');
const config = require('../config/config');

const client = new Client({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: 5432
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection error', err));

module.exports = client;
