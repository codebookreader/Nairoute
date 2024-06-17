const path = require('path');
const express = require('express');
const mysql = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mysql2'));
const cors = require(path.join(__dirname, '..', 'backend', 'node_modules', 'cors'));
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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
  user: 'root',
  password: 'MyOscVic2@',
  database: 'nairoutedatabase'
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

  const sql = 'INSERT INTO Commuter (email, firstName, secondName, phoneNumber, password) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [email, firstName, secondName, phoneNumber, password], (err, result) => {
    if (err) {
      console.error('Error inserting into database:', err);
      return res.status(500).json({ message: 'Registration failed', error: err });
    }
    console.log('Database insertion result:', result);
    res.status(201).json({ message: 'Registration successful' });
  });
});

// Define API route
app.get('/api/users', (req, res) => {
  let sql = 'SELECT * FROM commuter';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/login',(req,res)=>{
  const sql = 'SELECT * FROM Commuter WHERE email = ? and password = ?'
  db.query(sql,[req.body.email,req.body.password ],(err,data)=>{
    if (err){ 
      return res.json("Error")
    }
    if (data.length > 0) {
      req.session.email = data[0].email;
      return res.json({ Login: true, email: req.session.email });
    } else {
      return res.json({ Login: false, message: "Wrong password or email provided" });
    }
  })
})

// Reset password
app.post('/resetpassword',(req,res)=>{
  const sql = 'SELECT * FROM Commuter WHERE email = ? and phoneNumber = ?'
  db.query(sql,[req.body.email,req.body.phoneNumber ],(err,data)=>{
    if (err){ 
      return res.json("Error")
    }
    if (data.length > 0){
      return res.json({Success:true,message:"You can proceed with password reset"})
    }
    else{
      return res.json({Success:false,message:"No record found "})
    }
  })
})

// Set new password
app.post('/setnewpassword',(req,res)=>{
  const sql = 'UPDATE Commuter SET password = ? WHERE email = ?'
  db.query(sql,[req.body.newPassword,req.body.email],(err,data)=>{
    if (err){
      return res.json({Success:false,message:"Error updating password"})
    }
    return res.json({Success:true,message:"Successfully updated, redirecting to login page"})
  })
})

// View dashboard
app.get('/dashboard',(req,res)=>{
  if(req.session.email){
    return res.json({valid: true,email: req.session.email})
  } else {
    return res.json({valid: false})
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});