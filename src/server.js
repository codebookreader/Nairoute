 
const path = require('path')
const express = require('express');
const mysql = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mysql2'));
const cors = require(path.join(__dirname, '..', 'backend', 'node_modules', 'cors'));
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const { METHODS } = require('http');
const app = express();
const port = 5000;


// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  METHODS:['POST','GET'],
  credentials:true
}));

//session and cookies
app.use(cookieParser())
app.use(bodyparser.json())
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false,
  cookie:{
    secure:false,
    maxAge:1000*60*60*24
  }
}))


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

// Define an API route
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
    if (data.length > 0){
      req.session.email = data[0].email
      return res.json({Login:true,email:req.session.email});
    }
    else{
      return res.json({ Login: false, message: "Wrong password or email provided" })
    }

  })
})
app.post('/resetpassword',(req,res)=>{
  const sql = 'SELECT * FROM Commuter WHERE email = ? and phoneNumber = ?'
  db.query(sql,[req.body.email,req.body.phoneNumber ],(err,data)=>{
    if (err){ 
      return res.json("Error")
    }
    if (data.length > 0){
      return res.json("You can proceed with password reset")
    }
    else{
      return res.json("No record found, please confirm details entered")
    }

  })
})
app.get('/dashboard',(req,res)=>{
  if(req.session.email){
    return res.json({valid: true,email: req.session.email})
  }
  else{
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
