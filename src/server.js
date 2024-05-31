const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root1',
  password: 'basedatawordpassw3n',
  database: 'nairoutedb'
});

// Function to handle database connection
const connectToDatabase = () => {
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      setTimeout(connectToDatabase, 2000); // Retry connection after 2 seconds
    } else {
      console.log('MySQL connected...');
    }
  });

  db.on('error', (err) => {
    console.error('Database error:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectToDatabase(); // Reconnect if connection is lost
    } else {
      throw err;
    }
  });
};

// Establish initial connection
connectToDatabase();

// Define an API route
app.get('/api/users', (req, res) => {
  let sql = 'SELECT * FROM commuter';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      res.status(500).send('Error fetching data from the database');
    } else {
      res.send(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});