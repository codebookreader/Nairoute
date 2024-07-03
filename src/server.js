const path = require('node:path');
const express = require('express');
const nodemailer = require('nodemailer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mysql = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mysql2'));
const cors = require(path.join(__dirname, '..', 'backend', 'node_modules', 'cors'));

const otpStore = {};
/*
 * Instantialize the app and set up the port number
 */
const app = express();
const port = 5000;

/*
 * Middleware to parse JSON bodies and enable CORS
 */
app.use(express.json());

// Localhost and 127.0.0.1 were treated differently
const allowedOrigins = new Set(['http://localhost:3000', 'http://127.0.0.1:3000']);

app.use(cors({
	origin(origin, callback) {
		// Allow requests with no origin (like mobile apps, curl requests, etc.)
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

/*
 * Session and cookies middleware
 */
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

/*
 * Database connection
 */
const database = mysql.createConnection({
	host: 'localhost',
	user: 'root1',
	password: 'basedatawordpassw3n',
	database: 'nairoutedb',
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
	const {email, firstName, secondName, phoneNumber, password} = request.body;
	console.log('Incoming registration data:', request.body);

	const sql = 'INSERT INTO commuter (email, firstName, secondName, phoneNumber, password) VALUES (?, ?, ?, ?, ?)';
	database.query(sql, [email, firstName, secondName, phoneNumber, password], (error, result) => {
		if (error) {
			console.error('Error inserting into database:', error);
			return res.status(500).json({message: 'Registration failed', error});
		}

		console.log('Database insertion result:', result);
		res.status(201).json({message: 'Registration successful'});
	});
});

/*
 * API endpoint for users
 */
app.get('/api/users', (request, res) => {
	const sql = 'SELECT * FROM commuter';
	database.query(sql, (error, results) => {
		if (error) {
			throw error;
		}

		res.send(results);
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
			return res.json({Login: true, email: request.session.email});
		}

		return res.json({Login: false, message: 'Wrong password or email provided'});
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
			return res.json({Success: true, message: 'You can proceed with password reset'});
		}

		return res.json({Success: false, message: 'No record found '});
	});
});

/*
 * Set new password
 */
app.post('/setnewpassword', (request, res) => {
	const sql = 'UPDATE commuter SET password = ? WHERE email = ?';
	database.query(sql, [request.body.newPassword, request.body.email], (error, data) => {
		if (error) {
			return res.json({Success: false, message: 'Error updating password'});
		}

		return res.json({Success: true, message: 'Successfully updated, redirecting to login page'});
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

/*
 * Unlock screen
 */
app.post('/unlock', (request, res) => {
	const sql = 'SELECT * FROM commuter WHERE password = ?';
	database.query(sql, [request.body.password], (error, data) => {
		if (error) {
			return res.json({success: false, message: 'Error'});
		}

		if (data.length > 0) {
			return res.json({success: true});
		}

		return res.json({success: false, message: 'Incorrect password'});
	});
});

/*
 * Logout logged in user
 */
app.post('/logout', (request, res) => {
	request.session.destroy(error => {
		if (error) {
			return res.json({success: false, message: 'Logout failed'});
		}

		res.clearCookie('connect.sid');
		return res.json({success: true, message: 'Logged out successfully'});
	});
});

/*
 * Display all routes
 */
app.post('/showall', (request, res) => {
	const sql = 'select * from Routes where startLocation = ? and endLocation = ?';
	database.query(sql, [request.body.origin, request.body.destination], (error, data) => {
		if (error) {
			console.log(error);
			return res.json({success: false, message: 'An error occured'});
		}

		if (data.length > 0) {
			return res.json({success: true, message: 'pass', data});
		}

		return res.json({success: false, message: 'No record found'});
	});
});

/*
 * Endpoint to send OTP via email
 */
app.post('/send-otp', (request, res) => {
	const {email} = request.body;

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
		subject: 'OTP Verification',
		html: `<p>Your OTP is ${otp}</p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.status(500).json({message: 'Failed to send OTP'});
		} else {
			console.log('Email sent: ' + info.response);
			res.status(200).json({message: 'OTP sent successfully'});
		}
	});
});

/*
 * Endpoint to verify OTP entered by the user
 */
app.post('/verify-otp', (request, res) => {
	const {email, otp} = request.body;

	database.query('SELECT * FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1', [email], (error, results) => {
		if (error) {
      console.log('Error encountered')
			return res.status(500).send('Error retrieving OTP');
		}
    console.log('There is no error')
    console.log('Results:', results)
	
  console.log('We are outside query')
  console.log('Results:', results)

	if (results.length === 0 || results[0].otp !== otp) {
	    console.log('We have an invalid OTP');
		return res.status(400).send('Invalid OTP');
	}

	    console.log('We have a valid OTP');
    });
	// Delete the OTP after successful verification
	database.query('DELETE FROM otps WHERE email = ?', [email], (error, results) => {
		if (error) {
			return res.status(500).send('Error deleting OTP');
		}

		res.status(200).json({message: 'OTP verified'});
	});
});


/*
 * Start the server
 */
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
