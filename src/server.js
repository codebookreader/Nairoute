const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your actual frontend URL
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

// Endpoint to send OTP via email
app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit OTP

  // Save OTP in session for verification
  req.session.otp = otp;

  // Send OTP via email (replace with your actual email sending code)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'OTP Verification',
    html: `<p>Your OTP is ${otp}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send OTP' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'OTP sent successfully' });
    }
  });
});

// Endpoint to verify OTP entered by the user
app.post('/verify-otp', (req, res) => {
  const { otp } = req.body;
  const sessionOTP = req.session.otp;

  if (otp === sessionOTP) {
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});