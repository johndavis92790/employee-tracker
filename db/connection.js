const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // my mysql username,
  user: 'root',
  // my mysql password
  password: 'password',
  database: 'company'
});

module.exports = db;