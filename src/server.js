require('dotenv').config();
const path = require('node:path');
const express = require('express');
const nodemailer = require('nodemailer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mysql2'));
const cors = require(path.join(__dirname, '..', 'backend', 'node_modules', 'cors'));
const scrapeData = require('./infogetter'); // Adjust the path if needed
const stripe = require('stripe')('sk_test_51PavotGZx3XfZC2x5jlhtEGzv0sd0vlLxhxxpsJUPsFht7gHOCJb0I7qYuxBSOC6OcAuDIne5ka6rPX5rFDjGmZZ00pbK53swv');
const { v4: uuid } = require('uuid');
const apiUrl = process.env.REACT_APP_API_URL;

const otpStore = {};

const app = express();
const port = 5000;

app.use(express.json());

const allowedOrigins = new Set(['http://localhost:3000', 'http://127.0.0.1:3000']);

app.use(cors({
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        if (!allowedOrigins.has(origin)) {
            const message = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
    methods: ['POST', 'GET'],
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MyOscVic2@',
    database: 'nairoutedatabase',
});

database.connect(error => {
    if (error) {
        throw error;
    }
    console.log('MySQL connected...');
});

/*
 * Registration endpoint
 */
app.post('/register', (request, res) => {
    const { email, firstName, secondName, phoneNumber, password } = request.body;
    console.log('Incoming registration data:', request.body);

    const sql = 'INSERT INTO commuter (email, firstName, secondName, phoneNumber, password) VALUES (?, ?, ?, ?, ?)';
    database.query(sql, [email, firstName, secondName, phoneNumber, password], (error, result) => {
        if (error) {
            console.error('Error inserting into database:', error);
            return res.status(500).json({ message: 'Registration failed', error });
        }

        console.log('Database insertion result:', result);
        res.status(201).json({ message: 'Registration successful' });
    });
});

/*
 * API endpoint for users
 */
app.get('/api/users', (request, res) => {
    const sql = 'SELECT email, firstName, SecondName, phoneNumber, ApplicationStatus, Status FROM commuter';
    database.query(sql, (error, results) => {
        if (error) {
            throw error;
        }

        return res.json(results);
    });
});

app.get('/api/data', async (req, res) => {
    try {
        const response = await fetch(apiUrl); // Using the environment variable
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Register driver
app.post('/driverregister', (request, res) => {
    const { email, firstName, secondName, phoneNumber, license, password } = request.body;
    console.log('Incoming registration data:', request.body);

    const sql = 'INSERT INTO driver (email, firstName, secondname, phoneNumber, licenseNumber, password) VALUES (?, ?, ?, ?, ?, ?)';
    database.query(sql, [email, firstName, secondName, phoneNumber, license, password], (error, result) => {
        if (error) {
            console.error('Error inserting into database:', error);
            return res.status(500).json({ message: 'Registration failed', error });
        }

        res.status(201).json({ message: 'Registration successful' });
    });
});

/*
 * API endpoint for drivers
 */
app.get('/api/drivers', (request, res) => {
    const sql = 'SELECT email, firstName, secondname, phoneNumber, licenseNumber, ApplicationStatus, Status FROM driver';
    database.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        return res.json(results);
    });
});

// Approve commuter application
app.post('/api/commuter', (request, res) => {
    const { email } = request.body;
    const sql = 'UPDATE commuter SET ApplicationStatus = ? WHERE email = ?';
    database.query(sql, ['Approved', email], (error, results) => {
        if (error) {
            throw error;
        }
        return res.json({ message: 'Commuter approved' });
    });
});

// Approve driver application
app.post('/api/driver', (request, res) => {
    const { email } = request.body;
    const sql = 'UPDATE driver SET ApplicationStatus = ? WHERE email = ?';
    database.query(sql, ['Approved', email], (error, results) => {
        if (error) {
            throw error;
        }
        return res.json({ message: 'Driver approved' });
    });
});

// Ban commuter
app.post('/api/commuterban', (request, res) => {
    const { email } = request.body;
    const sql = 'UPDATE commuter SET ApplicationStatus = ?, Status = ? WHERE email = ?';
    database.query(sql, ['Banned', 'Banned', email], (error, results) => {
        if (error) {
            throw error;
        }
        return res.json({ message: `Commuter with email ${email} has been banned` });
    });
});

// Update commuter status based on last login
app.post('/api/updateStatus', (request, res) => {
    const { status } = request.body;
    const currentDate = new Date();
    const lastLoginSql = 'SELECT email, lastLogin FROM commuter';
    database.query(lastLoginSql, (error, results) => {
        if (error) {
            throw error;
        }

        results.forEach((row) => {
            const { email, lastLogin } = row;
            const timeDifference = currentDate.getTime() - new Date(lastLogin).getTime();
            const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

            let updatedStatus;
            if (daysDifference <= 7) {
                updatedStatus = 'Active';
            } else if (daysDifference <= 30) {
                updatedStatus = 'Inactive';
            } else {
                updatedStatus = 'Dormant';
            }

            const updateStatusSql = 'UPDATE commuter SET Status = ? WHERE email = ?';
            database.query(updateStatusSql, [updatedStatus, email], (error, results) => {
                if (error) {
                    throw error;
                }
            });
        });

        return res.json({ message: 'Status updated' });
    });
});

/*
 * Login user
 */
app.post('/login', (request, res) => {
    const sql = 'SELECT * FROM commuter WHERE email = ? and password = ?';
    database.query(sql, [request.body.email, request.body.password], (error, data) => {
        if (error) {
            return res.json('Error');
        }

        if (data.length > 0) {
            request.session.email = data[0].email;

            // Update lastLogin column with current date
            const currentDate = new Date();
            const updateLastLoginSql = 'UPDATE commuter SET lastlogin = ? WHERE email = ?';
            database.query(updateLastLoginSql, [currentDate, request.body.email], (error, result) => {
                if (error) {
                    console.error('Error updating last login:', error);
                }
            });

            return res.json({ Login: true, email: request.session.email });
        }

        return res.json({ Login: false, message: 'Wrong password or email provided' });
    });
});

/*
 * Reset password
 */
app.post('/resetpassword', (request, res) => {
    const sql = 'SELECT * FROM commuter WHERE email = ? and phoneNumber = ?';
    database.query(sql, [request.body.email, request.body.phoneNumber], (error, data) => {
        if (error) {
            return res.json('Error');
        }

        if (data.length > 0) {
            return res.json({ Success: true, message: 'You can proceed with password reset' });
        }

        return res.json({ Success: false, message: 'No record found' });
    });
});

/*
 * Set new password
 */
app.post('/setnewpassword', (request, res) => {
    const sql = 'UPDATE commuter SET password = ? WHERE email = ?';
    database.query(sql, [request.body.newPassword, request.body.email], (error, data) => {
        if (error) {
            return res.json({ Success: false, message: 'Error updating password' });
        }

        return res.json({ Success: true, message: 'Successfully updated, redirecting to login page' });
    });
});

/*
 * Display dashboard
 */
app.get('/dashboard', (request, res) => {
	if (request.session.email) {
        
		return res.json({valid: true, email: request.session.email});

	}

	return res.json({valid: false});
});

//
app.get('/driverdashboard', (request, res) => {
    if (request.session.driverEmail) {
        return res.json({valid: true, email: request.session.driverEmail});
    }
    else{
    console.log('Error: Driver email not found');
    return res.json({valid: false});
    }
});

// Login as admin
app.post('/adminlogin', (request, res) => {
    const sql = 'SELECT * FROM admin WHERE email = ? and password = ?';
    database.query(sql, [request.body.email, request.body.password], (error, data) => {
        if (error) {
            return res.json('Error');
        }

        if (data.length > 0) {
            request.session.adminemail = data[0].email;
            return res.json({ Login: true, email: request.session.adminemail });
        }

        return res.json({ Login: false, message: 'Wrong password or email provided' });
    });
});

// Login as driver
app.post('/driverlogin', (request, res) => {
    const sql = 'SELECT * FROM driver WHERE email = ? and password = ?';
    database.query(sql, [request.body.driverEmail, request.body.password], (error, data) => {
        if (error) {
            return res.json('Error');
        }

        if (data.length > 0) {
            request.session.driverEmail = data[0].email;
             // Update lastLogin column with current date
             const currentDate = new Date();
             const updateLastLoginSql = 'UPDATE driver SET lastlogin = ? WHERE email = ?';
             database.query(updateLastLoginSql, [currentDate, request.body.driverEmail], (error, result) => {
                 if (error) {
                     console.error('Error updating last login:', error);
                 }
             });
            return res.json({Login: true, email: request.session.driverEmail});
        }

        return res.json({ Login: false, message: 'Wrong password or email provided' });
    });
});

/*
 * Display admin page
 */
app.get('/adminpage', (request, res) => {
    if (request.session.adminemail) {
        return res.json({ valid: true, email: request.session.adminemail });
    }

	return res.json({valid: false});
});
//view profile
app.post('/profile', (req, res) => {
    const { userType, email } = req.body;
    const sql = `SELECT * FROM ${userType} WHERE email = ?`;
    database.query(sql, [email], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ profile: results[0] });
    });
});
app.post('/cost', (req, res) => { 
    const { routeid } = req.body;  
    const sql = 'SELECT cost FROM routes2 WHERE routeid = ?';
    database.query(sql, [routeid], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        console.log(cost)
        return res.status(404).json({ message: 'Route not found' });
      }
      console.log(results);
      return res.json({ cost: results[0].cost });
    });
  });
  

/*
 * Unlock screen
 */
app.post('/unlock', (request, res) => {
    const sql = 'SELECT * FROM commuter WHERE password = ?';
    database.query(sql, [request.body.password], (error, data) => {
        if (error) {
            return res.json({ success: false, message: 'Error' });
        }

        if (data.length > 0) {
            return res.json({ success: true });
        }

        return res.json({ success: false, message: 'Incorrect password' });
    });
});

/*
 * Logout logged in user
 */
app.post('/logout', (request, res) => {
    request.session.destroy(error => {
        if (error) {
            return res.json({ success: false, message: 'Logout failed' });
        }

        res.clearCookie('connect.sid');
        return res.json({ success: true, message: 'Logged out successfully' });
    });
});

/*
 * Display all routes
 */
app.post('/showall', (request, res) => {
    const sql = 'SELECT * FROM Routes2 WHERE source = ? AND destination = ?';
    database.query(sql, [request.body.origin, request.body.destination], (error, data) => {
        if (error) {
            console.log(error);
            return res.json({ success: false, message: 'An error occurred' });
        }

        if (data.length > 0) {
            res.data = data;
            return res.json({ success: true, message: 'pass', data });
        }

        return res.json({ success: false, message: 'No record found' });
    });
});

app.get('/api/routes', (req, res) => {
    const { origin, destination } = req.query;

    const sql = 'SELECT * FROM Routes2 WHERE source = ? AND destination = ?';
    database.query(sql, [origin, destination], (error, results) => {
        if (error) {
            console.error('Error fetching routes:', error);
            return res.status(500).json({ success: false, message: 'An error occurred', error });
        }

        if (results.length > 0) {
            return res.json({ success: true, data: results });
        }

        return res.status(404).json({ success: false, message: 'No routes found.' });
    });
});

app.post('/api/data/bookings', (req, res) => {
    const { commuter, vehicle, bookingDate, bookingStatus, routeNumber } = req.body;
  
    if (!commuter || !vehicle || !bookingDate || !bookingStatus || !routeNumber) {
      return res.status(400).send('All fields are required');
    }
  
    const query = `INSERT INTO bookings (commuter, vehicle, bookingDate, bookingStatus, routeNumber) VALUES (?, ?, ?, ?, ?)`;
    database.query(query, [commuter, vehicle, bookingDate, bookingStatus, routeNumber], (err, result) => {
      if (err) {
        console.error('Error inserting booking:', err);
        return res.status(500).send('Server error');
      }
      res.status(200).send('Booking confirmed');
    });
  });
  
/*
 * Endpoint to send OTP via email
 */
app.post('/send-otp', (request, res) => {
    const { email } = request.body;

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP for verification
    const sql = 'INSERT INTO otps (email, otp) VALUES (?, ?)';
    database.query(sql, [email, otp], (error, result) => {
        if (error) {
            console.error('Error inserting into database:', error);
        }

        console.log('Database insertion result:', result);
    });

    // Send email
    const transporter = nodemailer.createTransport({
        service: 'zoho',
        auth: {
            user: 'edkinuthiaa@zohomail.com',
            pass: '7_Y9sENVQgVQWSe',
        },
    });

    const mailOptions = {
        from: 'edkinuthiaa@zohomail.com',
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP for email verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending OTP email:', error);
            return res.status(500).json({ message: 'Failed to send OTP', error });
        }

        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'OTP sent successfully' });
    });
});

/*
 * Endpoint to verify OTP
 */
app.post('/verify-otp', (request, res) => {
    const { email, otp } = request.body;

    const sql = 'SELECT * FROM otps WHERE email = ? AND otp = ?';
    database.query(sql, [email, otp], (error, data) => {
        if (error) {
            return res.json({ success: false, message: 'Error' });
        }

        if (data.length > 0) {
            return res.json({ success: true, message: 'OTP verification successful' });
        }

        return res.json({ success: false, message: 'Incorrect OTP' });
    });
});

/*
 * Fetch all buses available
 */
app.get('/api/busdetails', async (req, res) => {
    try {
        const data = await scrapeData();
        console.log('API response data:', data);
        res.json(data);
    } catch (error) {
        console.error('Error in API endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// View driver earnings
app.get('/api/driverEarnings', (request, res) => {
	const sql = `SELECT d.email AS driver, b.bookingid AS booking_id, p.paymentDate AS payment_date, p.amountToPay AS amount_paid
	FROM driver d JOIN bookings b ON b.driver = d.email JOIN payments p ON b.bookingid = p.bookingid where p.paymentStatus = 'Paid'`;
	database.query(sql, (error, results) => {
		if (error) {
			throw error;
		}
		console.log(results);
		return res.json(results);
		});
})
//payments
app.post('/payment', async (req, res) => {
    const { booking, token } = req.body;
    console.log('Booking:', booking);
    console.log('Fare:', booking.cost);
    const idempotencyKey = uuid();
  
    try {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });
  
      const charge = await stripe.charges.create({
        amount: booking.cost * 100,  
        currency: 'usd',
        customer: customer.id,
        receipt_email: token.email,
        description: `Payment for ${booking.BusBooked}`,
      }, { idempotencyKey });
  
      res.status(200).json(charge);
    } catch (error) {
      console.error('Error creating charge:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/api/updatepayments', (req, res) => {
    const { date, cost, routeNumber, commuter } = req.body;
    const paymentStatus = 'Paid';
  
    console.log('Received data:', { date, cost, routeNumber, commuter });
  
    const sql = 'INSERT INTO payments (bookingid, paymentDate, paymentStatus, amountToPay, routeid) VALUES (?, ?, ?, ?, ?)';
    const selectSql = 'SELECT bookingid FROM bookings WHERE routeNumber = ? AND bookingDate = ? AND commuter = ?';
  
    database.query(selectSql, [routeNumber, date, commuter], (error, results) => {
      if (error) {
        console.error('Error selecting bookingid:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        console.error('No booking found for', { routeNumber, date, commuter });
        return res.status(404).json({ error: 'No booking found' });
      }
  
      const bookingid = results[0].bookingid;
  
      database.query(sql, [bookingid, date, paymentStatus, cost, routeNumber], (error, result) => {
        if (error) {
          console.error('Error inserting into payments table:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.status(201).json({ message: 'Payment details updated' });
      });
    });
  });
  

//get bookings
app.get('/api/booking', (request, res) => {
    const sql = 'SELECT * FROM bookings';
    database.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        return res.json(results);
    });
});

/*
 * Start the server
 */
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
