import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import { hashPassword, verifyPassword } from './utils/password.js';
import pool from './config/db.js'

const otpStore = {};
const stripeSecreyKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecreyKey);
const apiUrl = process.env.REACT_APP_API_URL;

const app = express();
const port = process.env.PORT;//

app.use(express.json());


const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

/*const database = mysql.createConnection({
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
app.post('/commuter/register', async (request, res) => {
    const { email, first_name, second_name, phone_number, password } = request.body;
    try{
    const hashedPassword = hashPassword(password);
    console.log('Incoming registration data:', request.body);

    const sql = 'INSERT INTO commuter (email, first_name, second_name, phone_number, password) VALUES ($1, $2, $3, $4, $5) RETURNING email';
    const result = await pool.query(sql, [email, first_name, second_name, phone_number, hashedPassword]);
    return res.status(201).json({message:'Registration successful',email:result.rows[0].email})
    }
    catch(error){
        console.error('Commuter registration Error: ',error.message);
        return res.status(500).json({ message:'Internal Server Error'});
    }
    });

// Register drivers
app.post('/driver/register', async (request, res) => {
    const { email, first_name, second_name, phone_number, license_number, password } = request.body;
    try{
    const hashedPassword = hashPassword(password);
    console.log('Incoming registration data:', request.body);

    const sql = 'INSERT INTO driver (email, first_name, second_name, phone_number, license_number, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING email';
    const result = await pool.query(sql, [email, first_name, second_name, phone_number, license_number, hashedPassword]);
    res.status(201).json({message:'Registration successful',email:result.rows[0].email});
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
app.post('/commuter/login', async (req, res) => {
    const {email,password} = req.body;
    try{
    const sql = 'SELECT password,email FROM commuter WHERE email = $1';
    const result = await pool.query(sql, [email]);
    if (result.rows.length > 0 ){
        const commuter = result.rows[0];
        if(verifyPassword(password,commuter.password)){
        req.session.email = commuter.email;
        // Update lastLogin column with current date
        await pool.query('UPDATE commuter SET last_login = NOW() WHERE email = $1',[email]);
        return res.status(200).json({Login:true,email:req.session.email});
    }
    return res.status(401).json({Login:false,message:'Invalid email or password'})
    }}
    catch(error){
        console.error('Commuter Login error: ',error.message);
        return res.status(500).json({message:'Internal Server Error'});  
    }});

    // Login as driver
app.post('/driver/login', async (req, res) => {
    const {email,password} = req.body;
    try{
    const sql = 'SELECT password,email FROM driver WHERE email = $1';
    const result = await pool.query(sql, [email]);
    if(result.rows.length > 0){
        const driver = result.rows[0];
        if(verifyPassword(password,driver.password)){
            req.session.email = driver.email;

            await pool.query('UPDATE driver SET last_login = NOW() WHERE email = $1',[email]);
            return res.status(200).json({Login:true,email:req.session.email});
        }
        return res.status(401).json({Login:false,message:'Invalid email or password'});
    }
    return res.status(401).json({Login:false,message:'Invalid email or password'});
    }
    catch(error){
        console.error('Driver Login error ',error.message);
        return res.status(500).json({message:'Internal Server Error'})
    }
});


/*
 * API endpoint for users
 */
app.get('/api/users',  async (request, res) => {
    try{
    const sql = 'SELECT email, first_name, second_name, phone_number, application_status, status FROM commuter';
    const result= await pool.query(sql);
    if(result.rows.length===0){
        return res.status(404).json({message:'No commuters found'});
    }
    return res.status(200).json(result.rows);
    }
    catch(error){
        console.error("Error when fetching data ",error);
        return res.status(500).json({message:'Internal Server Error'});
    }
})

/*
 * API endpoint for drivers
 */
app.get('/api/drivers',  async (request, res) => {
    try{
    const sql = 'SELECT email, first_name, second_name, phone_number, application_status, status FROM driver';
    const result= await pool.query(sql);
    if(result.rows.length===0){
        return res.status(404).json({message:'No drivers found'});
    }
    return res.status(200).json(result.rows);
    }
    catch(error){
        console.error("Error when fetching data ",error);
        return res.status(500).json({message:'Internal Server Error'});
    }
})


/*
app.get('/api/data', async (req, res) => {
    try {
        const response = await fetch(apiUrl); // Using the environment variable
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
});*/


// Approve commuter application
app.patch('/api/commuter', async (request, res) => {
    const { email } = request.body;
    const status = 'approved';
    try{
    const sql = 'UPDATE commuter SET application_status = $1 WHERE email = $2';
     const result = await pool.query(sql, [status, email]);
     if(result.rowCount === 0){
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
app.patch('/api/driver', async (request, res) => {
    const { email } = request.body;
    const status = 'approved';
    try{
    const sql = 'UPDATE driver SET application_status = $1 WHERE email = $2';
     const result = await pool.query(sql, [status, email]);
     if(result.rowCount === 0){
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
    const sql = 'UPDATE commuter SET application_status = $1, status = $2 WHERE email = $3';
    const result = await pool.query(sql, [application_status, status, email])
    if(result.rowCount === 0){
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
      SET status = CASE
        WHEN last_login >= NOW() - INTERVAL '7 days' THEN 'Active'
        WHEN last_login >= NOW() - INTERVAL '30 days' THEN 'Inactive'
        ELSE 'Dormant'
      END
      WHERE last_login IS NOT NULL;
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
app.get('/resetpassword', async(request, res) => {
    const{email,phone_number} = request.body;
    try{
    const sql = 'SELECT * FROM commuter WHERE email = $1 and phone_number = $2';
    const result = await pool.query(sql, [email, phone_number]);
    if(result.rowCount > 0){
        return res.status(200).json({message:"Proceed with Password Reset"})
    }
    return res.status(404).json({message:'Credentials not found'})
}catch(error){
    console.error('Reset Password Error ',error);
    res.status(500).json({message:'Internal Server Error'});
    
}

});

/*
 * Set new password
 */
app.patch('/setnewpassword', async(request, res) => {
    const{newPassword,email} = request.body;
    try{
    const hashedNewPassword = hashPassword(newPassword)
    const sql = 'UPDATE commuter SET password = $1 WHERE email = $2';
    const result = await pool.query(sql, [hashedNewPassword,email]);
    if(result.rowCount > 0){
        return res.status(200).json({message:'Password updated successfully'});
    }
    return res.status(404).json({message:'User not found'});
    }
    catch(error){
        console.error('Error setting new Password', error);
        return res.status(500).json({message:'Internal Server Error'});
        
    }
});

/*
 * Display dashboard
 */
app.get('/dashboard', (request, res) => {
	if (request.session.email) {  
		return res.status(200).json({valid: true, email: request.session.email});
	}
    console.log(`Error: commuter email not found`)
	return res.status(404).json({valid: false});
});

//
app.get('/driverdashboard', (request, res) => {
    if (request.session.driverEmail) {
        return res.json({valid: true, email: request.session.driverEmail});
    }
    else{
    console.log('Error: Driver email not found');
    return res.status(404).json({valid: false});
    }
});

// Login as admin
app.post('/adminlogin', async(request, res) => {
    try{
    const sql = 'SELECT * FROM admin WHERE email = $1 and password = $2';
    const result = pool.query(sql, [request.body.email, request.body.password])  
    if ((await result).rowCount > 0) {
        request.session.adminemail = data[0].email;
        return res.json({ Login: true, email: request.session.adminemail });
    }
    return res.status(401).json({ Login: false, message: 'Invalid email or password' });
    }
    catch(error){
        console.error('Admin login error', error);
        res.status(500).json({message:'Internal Server Error'});
        
    }
    });



/*
 * Display admin page
 */
app.get('/adminpage', (request, res) => {
    if (request.session.adminemail) {
        return res.status(200).json({ valid: true, email: request.session.adminemail });
    }
     console.log('Error: Admin email not found');
    return res.status(404).json({valid: false});
});
//view profile
app.get('/profile', async(req, res) => {
    const { userType, email } = req.query;
    if(!userType || !email || typeof userType !== 'string' || typeof email !== 'string'){
        return res.status(400).json({message:"Missing or invalid parameters."})
    }
    
    const  normalizedUserTypes = userType.trim().toLowerCase()
    const normalizedEmail = email.trim().toLowerCase();
    const allowedTables = {
        commuter:'commuter',
        driver:'driver',
        admin:'admin'
    };
    const targetTable  = allowedTables[normalizedUserTypes]
    if(!targetTable){
        return res.status(400).json({error:'Invalid user type'})
    }
    try{
    const sql = `SELECT * FROM ${targetTable} WHERE LOWER(email} = $1`;
    const result = await pool.query(sql, [normalizedEmail]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ profile: result.rows[0] });
        }
    catch(error){
        console.error('Profile query error',error);
        return res.status(500).json({ message:'Internal Server Error'});
        }
    });
app.post('/cost', async (req, res) => {
    const { route_id } = req.body;  
    const sql = 'SELECT cost FROM routes WHERE route_id = $1';
    try {
        const result = await pool.query(sql, [route_id]);
        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Route Not Found'});
        }
        return res.status(200).json({cost: result.rows[0].cost});
    }catch(error) {
        console.error(`An error ocurred when fetching cost: `, error.message);
        return res.status(500).json({message:'Internal Server Error'});
    }
  });
  

/*
 * Unlock screen
 *
app.post('/unlock',async (request, res) => {
    const {password} = request.body;
    if(!password){
        return res.status(400),json({message:'Missing password'});
    }
    if(verifyPassword())
    const sql = 'SELECT email FROM commuter WHERE password = $1';
    database.query(sql, [request.body.password], (error, data) => {
        if (error) {
            return res.json({ success: false, message: 'Error' });
        }

        if (data.length > 0) {
            return res.json({ success: true });
        }

        return res.json({ success: false, message: 'Incorrect password' });
    });
});*/

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
app.get('/showall',async (request, res) => {
    const {source,destination} = request.query;
    if(!source || !destination){
        return res.status(400).json({message:'Missing source or destination '})
    }
    const sql = 'SELECT * FROM routes WHERE source = $1 AND destination = $2';
    try{
        const result = await pool.query(sql, [source, destination]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Route data not found' });
        }
        return res.status(200).json({ success: true, message: 'pass', routes: result.rows });
    }
    catch(error){
        console.error('Error when fetching all routes',error.message);
        return  res.status(500).json({message:'Internal Server Error'});
    }
});

app.get('/api/routes',async (req, res) =>
{
    const {origin, destination} = req.query;
    if (!origin || !destination) {
        return res.status(400).json({message: 'Missing origin or destination'});
    }
    const sql = 'SELECT * FROM routes WHERE source = $1 AND destination = $2';
    try {
        const result = await pool.query(sql, [origin, destination]);
        if (result.rowCount === 0) {
            return res.status(404).json({success: false, message: 'No route found'});
        }
        console.log(result.rows);
        return res.json({success: true, data: result.rows});

    }
    catch(error){
        console.error('An error ocurred when fetching routes',error.message);
        return res.status(500).json({message:'Internal Server Error'});
    }
});

app.post('/commuter/book', async(req, res) => {
    const { commuter, vehicle, booking_date, booking_status, route_id } = req.body;
    console.log(commuter);
    if (!commuter || !vehicle || !booking_date || !booking_status || !route_id) {
      return res.status(400).json({message:'All fields are required'});
    }
  
    const sql = `INSERT INTO bookings (commuter, vehicle, booking_date, booking_status, route_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    try{
        const result = await pool.query(sql,[commuter, vehicle, booking_date, booking_status, route_id]);
          if (result.rowCount === 0) {
            return res.status(500).json({message:'Failed to create booking'});
          }
          res.status(201).json({message:'Booking confirmed',booking:result.rows[0]});
    }
    catch(error){
        console.error('An error occured when placing booking',error.message);
        return res.status(500).json({message:'Internal Server Error'});
    }
  });
  
/*
 * Endpoint to send OTP via email
 */
app.post('/send-otp', (request, res) => {
    const { email } = request.body;

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP for verification
    const sql = 'INSERT INTO otps (email, otp) VALUES ($1, $2)';
    pool.query(sql, [email, otp], (error, result) => {
        if (error) {
            console.error('Error inserting into database:', error);
        }

        console.log('Database insertion result:', result);
    });

    // Send email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
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

/*ai
 * Endpoint to verify OTP
 */
app.post('/verify-otp', (request, res) => {
    const { email, otp } = request.body;

    const sql = 'SELECT * FROM otps WHERE email = $1 AND otp = $2';
    pool.query(sql, [email, otp], (error, data) => {
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
	pool.query(sql, (error, results) => {
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
    const { date, cost, route_id, commuter } = req.body;
    const paymentStatus = 'Paid';
  
    console.log('Received data:', { date, cost, route_id, commuter });
  
    const sql = 'INSERT INTO payments (bookingid, paymentDate, paymentStatus, amountToPay, route_id) VALUES ($1, $2, $3, $4, $5)';
    const selectSql = 'SELECT bookingid FROM bookings WHERE route_id = $1 AND booking_date = $2 AND commuter = $3';
  
    pool.query(selectSql, [route_id, date, commuter], (error, results) => {
      if (error) {
        console.error('Error selecting bookingid:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        console.error('No booking found for', { route_id, date, commuter });
        return res.status(404).json({ error: 'No booking found' });
      }
  
      const bookingid = results[0].bookingid;
  
      pool.query(sql, [bookingid, date, paymentStatus, cost, route_id], (error, results) => {
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
    pool.query(sql, (error, results) => {
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
