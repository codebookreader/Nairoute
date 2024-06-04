const path = require('path')
const express = require('express');
const mysql = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mysql2'));
const cors = require(path.join(__dirname, '..', 'backend', 'node_modules', 'cors'));
const app = express();
const port = 5000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

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
      return res.json("Login Success")
    }
    else{
      return res.json("Wrong password or email provided")
    }

  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
