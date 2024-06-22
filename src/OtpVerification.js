import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState(location.state.email);
  const [userDetails, setUserDetails] = useState(location.state);

  const sendOTP = () => {
    const otp_val = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit OTP
    setGeneratedOtp(otp_val);

    const emailbody = `<h2>Your OTP is </h2>${otp_val}`;
    window.Email.send({
      SecureToken: "fbebd213-4ddf-45d9-b205-3f5313s01cs3",
      To: email,
      From: "edkinuthiaa@gmail.com",
      Subject: "Email OTP using JavaScript",
      Body: emailbody,
    }).then(message => {
      if (message === "OK") {
        alert("OTP sent to your email " + email);
        setIsOtpSent(true);
      } else {
        alert("Failed to send OTP");
      }
    });
  };

  const verifyOTP = async () => {
    if (otp === generatedOtp) {
      alert("Email address verified...");

      // Finalize registration
      try {
        const response = await axios.post('http://localhost:5000/register-final', userDetails);
        if (response.data.message === 'Registration successful') {
          alert("Registration completed successfully!");
          navigate('/login');
        } else {
          alert("Final registration failed");
        }
      } catch (err) {
        console.error('Error finalizing registration:', err);
        alert("Final registration failed");
      }
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>OTP Verification</h1>
        <p>We have sent an OTP to your email address: {email}</p>
        <button onClick={sendOTP}>Resend OTP</button>

        {isOtpSent && (
          <div className="otpverify" style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              id="otp_inp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button id="otp-btn" onClick={verifyOTP}>Verify OTP</button>
          </div>
        )}
      </div>
    </>
  );
};

export default OtpVerification;