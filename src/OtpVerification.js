import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      if (response.data.success) {
        navigate('/login');
      } else {
        setErrMsg('Invalid OTP');
      }
    } catch (err) {
      console.log('Error:', err);
      setErrMsg('OTP verification failed');
    }
  };

  return (
    <>
      <Navbar />
      <section>
        <h1>OTP Verification</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            autoComplete="off"
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
        {errMsg && <p className="errmsg" aria-live="assertive">{errMsg}</p>}
      </section>
    </>
  );
};

export default OtpVerification;