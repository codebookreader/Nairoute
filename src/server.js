import 'dotenv/config';
import path from 'node:path';
import express, { response } from 'express';
import nodemailer from 'nodemailer';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2';
//import scrapeData from './infogetter.js';
import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import { hashPassword, verifyPassword } from './utils/password.js';
import pool from './config/db.js'

const otpStore = {};
const stripeSecreyKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecreyKey);
const apiUrl = process.env.REACT_APP_API_URL;

const app = express();
const port = process.env.PORT;

app.use(express.json());

const allowedOrigins = new Set(['http://localhost:3000', 'http://127.0.0.1:3000']);

app.use(cors({
    origin(origin, callback) {
        if (!origin || !allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS policy error'),false);
    },
    methods: ['POST', 'GET'],
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

const database = mysql.createConnection({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

database.connect(error => {
    if (error) {
        throw error;
    }
    console.log('Postgres connected...');
});

/*
 * Registration endpoint
 */
// Register commuters
app.post('/register', async (request, res) => {
    const { email, firstName, secondName, phoneNumber, password } = request.body;
    try{
    const hashedPassword = hashPassword(password);
    console.log('Incoming registration data:', request.body);

    const sql = 'INSERT INTO commuter (email, firstName, secondName, phoneNumber, password) VALUES ($1, $2, $3, $4, $5) RETURNING email';
    const result = await pool.query(sql, [email, firstName, secondName, phoneNumber, hashedPassword]);
    return res.status(201).json({message:'Registration successful',email:result.rows[0].email})
    }
    catch(error){
        console.error('Commuter registration Error: ',error.message);
        return res.status(500).json({ message:'Internal Server Error'});
    }
    });

// Register drivers
app.post('/driverregister', async (request, res) => {
    const { email, firstName, secondName, phoneNumber, license, password } = request.body;
    try{
    const hashedPassword = hashPassword(password);
    console.log('Incoming registration data:', request.body);

    const sql = 'INSERT INTO driver (email, firstName, secondname, phoneNumber, licenseNumber, password) VALUES ($1, $2, $3, $4, $5, $6)';
    const result = await pool.query(sql, [email, firstName, secondName, phoneNumber, license, hashedPassword]);
    res.status(201).json({message:'Registration successful',email:result.rows[0].email})
    }
    catch(error){
        console.error('Driver registration failed',error.message);
        res.status(500).json({message:'Internal Server Error'});
    }
});

/*
 * Login endpoint
 */
//login commuters
app.post('/login', async (request, res) => {
    const {email,password} = req.body;
    try{
    const sql = 'SELECT * FROM commuter WHERE email = $1';
    const result = pool.query(sql, [email]);
    if (result.rows.length > 0 ){
        const commuter = result.rows[0];
        if(verifyPassword(password,commuter.password)){
        req.session.email = commuter.email;
        // Update lastLogin column with current date
        await pool.query('UPDATE commuter SET lastlogin = NOW() WHERE email = $1',[email]);
        return res.status(200).json({Login:true,email:req.session.email});
    }
    return res.status(401).json({Login:false,message:'Invalid email or password'})
    }}
    catch(error){
        console.error('Commuter Login error: ',error.message);
        return res.status(500).json({message:'Internal Server Error'});  
    }});

    // Login as driver
app.post('/driverlogin', async (req, res) => {
    const {email,password} = req.body;
    try{
    const sql = 'SELECT * FROM driver WHERE email = $1';
    const result = await pool.query(sql, [email]);
    if(result.rows.length > 0){
        const driver = result.rows[0];
        if(verifyPassword(password,driver.password)){
            req.session.email = driver.email;

            await pool.query('UPDATE driver SET lastlogin = NOW() WHERE email = $1',[email]);
            res.status(200).json({Login:true,email:req.session.email});
        }
        return res.status(401).json({Login:false,message:'Invalid email or password'});
    }
    }
    catch(error){
        console.error('Driver Login error ',error.message);
        res.status(500).json({message:'Internal Server Error'})
    }
});


/*
 * API endpoint for users
 */
app.get('/api/users',  async (request, res) => {
    try{
    const sql = 'SELECT email, firstName, SecondName, phoneNumber, ApplicationStatus, Status FROM commuter';
    const result= await pool.query(sql);
    if(result.rows.length>0){
        res.status(200).json({commuters:result.rows[0]});
    }
    }
    catch(error){
        console.error("Error when fetching data ",error);
        res.status(500).json({message:'Internal Server Error'});
    }
})

/*
 * API endpoint for drivers
 */
app.get('/api/drivers',  async (request, res) => {
    try{
    const sql = 'SELECT email, firstName, SecondName, phoneNumber, ApplicationStatus, Status FROM driver';
    const result= await pool.query(sql);
    if(result.rows.length>0){
        return res.status(200).json({drivers:result.rows[0]})
    }
    }
    catch(error){
        console.error("Error when fetching data ",error);
        return res.status(500).json({message:'Error fetching commuter data'});
    }
})



app.get('/api/data', async (req, res) => {
    try {
        const response = await fetch(apiUrl); // Using the environment variable
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
});


// Approve commuter application
app.patch('/api/commuter', async (request, res) => {
    const { email } = request.body;
    const status = 'approved';
    try{
    const sql = 'UPDATE commuter SET ApplicationStatus = $1 WHERE email = $2';
     const result = await pool.query(sql, [status, email]);
     if(result.rowCount == 0){
        return res.status(404).json({message:"Commuter application not found"});
     }
     return res.status(200).json({message:"Commuter approved",commuter:result.rows[0]});
      }
     catch(error){
        console.error("Error approving commuter ",error);
        return res.status(500).json({message:'Internal Server Error'})        
     }
   
});

// Approve driver application
app.patch('/api/commuter', async (request, res) => {
    const { email } = request.body;
    const status = 'approved';
    try{
    const sql = 'UPDATE driver SET ApplicationStatus = $1 WHERE email = $2';
     const result = await pool.query(sql, [status, email]);
     if(result.rowCount == 0){
        return res.status(404).json({error:'Driver application not found'})
     }
     res.status(200).json({message:"Driver application approved",driver:result.rows[0]})
      }
     catch(error){
        console.error("Error approving driver",error);
        res.status(500).json({message:'Internal Server Error'})        
     }
   
});

// Ban commuter
app.post('/api/commuterban', async(request, res) => {
    const { email } = request.body;
    const application_status = 'banned';
    const status = 'banned';
    try{
    const sql = 'UPDATE commuter SET ApplicationStatus = $1, Status = $2 WHERE email = $3';
    const result = await pool.query(sql, [application_status, status, email])
    if(result.rowCount == 0){
        return res.status(404).json({message:'Commuter not found'});
    }
    return res.status(200).json({message:'Ban successful',commuter:result.rows[0]});
    }
    catch(error){
        console.error('Error banning commuter ',error);
        res.status(500).json({message:'Internal Server Error'});
        
    }
});

// Update commuter status based on last login
app.patch('/api/commuter/status', async (req, res) => {
  try {
    const updateSql = `
      UPDATE commuter
      SET Status = CASE
        WHEN lastLogin >= NOW() - INTERVAL '7 days' THEN 'Active'
        WHEN lastLogin >= NOW() - INTERVAL '30 days' THEN 'Inactive'
        ELSE 'Dormant'
      END
      WHERE lastLogin IS NOT NULL;
    `;

    const result = await pool.query(updateSql);

    return res.status(200).json({
      message: 'Commuter statuses updated successfully.',
      updatedCount: result.rowCount
    });
  } catch (error) {
    console.error('Error updating commuter statuses:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
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
    const allowedTypes = ['commuter','driver','admin'];
    const sanitizedUserType = allowedTypes.includes(userType.trim().toLowerCase()) ? userType.trim().toLowerCase():null;
    if(!sanitizedUserType){
        return res.status(400).json({error:'Invalid user type'})
    }
    const sql = `SELECT * FROM ${sanitizedUserType} WHERE email = ?`;
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
 
app.get('/api/busdetails', async (req, res) => {
    try {
        const data = await scrapeData();
        console.log('API response data:', data);
        res.json(data);
    } catch (error) {
        console.error('Error in API endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});*/

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
