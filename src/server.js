const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Import nodemailer
const crypto = require('crypto'); // Import crypto for OTP generation

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

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Function to send OTP via email using nodemailer
const sendOTPEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password' // Replace with your email password
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending OTP email:', error);
    } else {
      console.log('OTP email sent:', info.response);
    }
  });
};

// Define API route for registration
app.post('/register', (req, res) => {
  const { email, firstName, secondName, phoneNumber, password } = req.body;
  console.log('Incoming registration data:', req.body);

  const otp = generateOTP(); // Generate OTP

  const sql = 'INSERT INTO commuter (email, firstName, secondName, phoneNumber, password, otp) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [email, firstName, secondName, phoneNumber, password, otp], (err, result) => {
      if (err) {
          console.error('Error inserting into database:', err);
          return res.status(500).json({ message: 'Registration failed', error: err });
      }
      console.log('Database insertion result:', result);
      sendOTPEmail(email, otp); // Send OTP email
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