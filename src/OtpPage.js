import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function OtpPage() {
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const sendOtp = async () => {
		try {
			const response = await axios.post('http://localhost:5000/send-otp', {email});
			console.log(response);
			setMessage(response.data.message);
		} catch {
			setMessage('Error sending OTP');
		}
	};

	const verifyOtp = async () => {
		try {
			const response = await axios.post('http://localhost:5000/verify-otp', {email, otp});
			setMessage('OTP validated successfully.Redirecting...');
			setTimeout(() => {
				navigate('/login');
			}, 2000);

		} catch {
			setMessage('Invalid OTP');
		}
	};

	return (
		<div className='App'>
			<h1>OTP Verification</h1>
			<div>
				<input
					type='email'
					placeholder='Enter email'
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<button onClick={sendOtp}>Send OTP</button>
			</div>
			<div>
				<input
					type='text'
					placeholder='Enter OTP'
					value={otp}
					onChange={e => setOtp(e.target.value)}
				/>
				<button onClick={verifyOtp}>Verify OTP</button>
			</div>
			<p>{message}</p>
		</div>
	);
}

export default OtpPage;
