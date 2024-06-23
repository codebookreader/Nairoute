import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const OtpVerification = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState(state?.email || '');
  const [errMsg, setErrMsg] = useState('');
  const errRef = useRef(null);

  const sendOTP = () => {
    const otp_val = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit OTP
    setGeneratedOtp(otp_val);

    const emailBody = `<h2>Your OTP is ${otp_val}</h2>`;
    window.Email.send({
      SecureToken: "752c13ea-51bc-4045-960d-8503cab117f5",
      To: email,
      From: "edkinuthiaa@gmail.com",
      Subject: "Email OTP Verification",
      Body: emailBody,
    }).then(message => {
      if (message === "OK") {
        alert("OTP sent to your email " + email);
        setIsOtpSent(true);
      } else {
        alert("Failed to send OTP");
      }
    }).catch(error => {
      console.error("Error in sending OTP:", error);
      alert("Failed to send OTP. Please check the console for details.");
    });
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      try {
        const response = await axios.post('http://localhost:5000/register-final', state);
        if (response.data.message === 'Registration successful') {
          alert("Registration completed successfully!");
          navigate('/login');
        } else {
          setErrMsg("Final registration failed");
        }
      } catch (err) {
        setErrMsg("Final registration failed");
        console.error('Error finalizing registration:', err);
      }
    } else {
      setErrMsg("Invalid OTP");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>OTP Verification</h1>
        <p>We have sent an OTP to your email address: {email}</p>
        <button onClick={sendOTP}>Resend OTP</button>
        {isOtpSent && (
          <form onSubmit={verifyOTP} className="otpverify" style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              id="otp_inp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        )}
      </div>
    </>
  );
};

export default OtpVerification;