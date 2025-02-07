const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default user for MySQL (update if necessary)
  password: '', // Default password for MySQL (update if necessary)
  database: 'gym_management', // Replace with your database name
});

// Check MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Example route to get data from MySQL
app.get('/members', (req, res) => {
  const query = 'SELECT * FROM members'; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
