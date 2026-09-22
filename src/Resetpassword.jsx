import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Resetpassword = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errMessage, setErrMessage] = useState('');

  const [newPasswordForm, setNewPasswordForm] = useState(false);
  const [otpForm, setOtpForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Send phone number for OTP
  const resetPassword = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/resetpassword', { email, phoneNumber })
      .then(res => {
        if (res.data.Success) {
          setOtpForm(true);
          setErrMessage('');
        } else {
          setErrMessage(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
        setErrMessage('An error occurred. Please try again.');
      });
  };

  // Send OTP
  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error sending OTP');
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      setMessage('OTP validated successfully');
      setTimeout(() => {
        setNewPasswordForm(true);
        setOtpForm(false);
        setMessage('');
      }, 1000);
    } catch (error) {
      setMessage('Invalid OTP');
    }
  };

  // Set new password on successful verification
  const handleNewPasswordSubmit = (event) => {
    event.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(newPassword)) {
      setErrMessage('Password must contain at least one capital letter, one symbol, and be at least 8 characters long.');
      return;
    }
    if (newPassword === confirmNewPassword) {
      axios.post('http://localhost:5000/setnewpassword', { email, newPassword })
        .then(res => {
          if (res.data.Success) {
            setSuccessMessage(res.data.message);
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          } else {
            setErrMessage(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
          setErrMessage('An error occurred. Please try again.');
        });
    } else {
      setErrMessage("The passwords do not match");
    }
  };

  return (
    <div>
      <Navbar />
      <div className='intro'>
        <h1>Welcome to the reset password page</h1>
        <h2>Enter the details below</h2>
      </div>
      {!newPasswordForm && !otpForm && (
        <form onSubmit={resetPassword}>
          <label htmlFor="email">Email</label>
          <input
            style={{ width: '50%' }}
            type="email"
            id="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            style={{ width: '50%' }}
            type="number"
            id="phoneNumber"
            autoComplete="off"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {errMessage && <p style={{ color: 'red' }}>{errMessage}</p>}
          <button type="submit">Submit</button>
        </form>
      )}
      {otpForm && (
        <div className='App'>
          <h1>Verify your email</h1>
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
      )}
      {newPasswordForm && (
        <div>
          <h2>Set New Password</h2>
          <form onSubmit={handleNewPasswordSubmit}>
            <label htmlFor="newPassword">New Password</label>
            <input
              style={{ width: '50%' }}
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              style={{ width: '50%' }}
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            {errMessage && <p style={{ color: 'red' }}>{errMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit">Set Password</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Resetpassword;
