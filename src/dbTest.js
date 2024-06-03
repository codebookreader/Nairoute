const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root1',
  password: 'basedatawordpassw3n',
  database: 'nairoutedb'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('MySQL connected...');

  // Test query
  const testQuery = 'SELECT 1 + 1 AS solution';
  db.query(testQuery, (err, results) => {
    if (err) {
      console.error('Error executing test query:', err.message);
      return;
    }
    console.log('Test query result:', results);
    db.end(); // Close the connection after the test
  });
});