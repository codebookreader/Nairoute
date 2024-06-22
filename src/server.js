const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'GET'],
  credentials: true
}));

// Session and cookies middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root1',
  password: 'basedatawordpassw3n',
  database: 'nairoutedb'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Define API route for registration
app.post('/register', (req, res) => {
  const { email, firstName, secondName, phoneNumber, password } = req.body;
  console.log('Incoming registration data:', req.body);

  const sql = 'INSERT INTO commuter (email, firstName, secondName, phoneNumber, password) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [email, firstName, secondName, phoneNumber, password], (err, result) => {
    if (err) {
      console.error('Error inserting into database:', err);
      return res.status(500).json({ message: 'Registration failed', error: err });
    }
    console.log('Database insertion result:', result);
    res.status(201).json({ message: 'Registration successful, please check your email for the OTP' });
  });
});

// Define API route for OTP verification
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const sql = 'SELECT * FROM Commuterp WHERE email = ? AND otp = ?';
  db.query(sql, [email, otp], (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Verification failed', error: err });
    }
    if (result.length > 0) {
      res.status(200).json({ success: true, message: 'OTP verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  });
});

// Define API route for final registration (after OTP verification)
app.post('/register-final', (req, res) => {
  const { email, firstName, secondName, phoneNumber, password } = req.body;

  const sqlInsert = 'INSERT INTO Commuter (email, firstName, secondName, phoneNumber, password) VALUES (?, ?, ?, ?, ?)';
  db.query(sqlInsert, [email, firstName, secondName, phoneNumber, password], (err, result) => {
    if (err) {
      console.error('Error inserting into final database:', err);
      return res.status(500).json({ message: 'Final registration failed', error: err });
    }

    // Cleanup: Remove from CommuterTemp after successful registration
    const sqlDelete = 'DELETE FROM Commuter WHERE email = ?';
    db.query(sqlDelete, [email], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Error cleaning up temporary database:', deleteErr);
        return res.status(500).json({ message: 'Cleanup failed', error: deleteErr });
      }
      res.status(201).json({ message: 'Registration successful', result });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});