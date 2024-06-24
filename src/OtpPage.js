import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const OtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [email, setEmail] = useState(state?.email || '');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
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
      console.log("Email send message:", message);
      if (message === "OK") {
        alert("OTP sent to your email " + email);
        setIsOtpSent(true); // Update state to show OTP input
      } else {
        console.error("Failed to send OTP:", message);
        alert("Failed to send OTP");
      }
    }).catch(error => {
      console.error("Error in sending OTP:", error);
      alert("Failed to send OTP. Please check the console for details.");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Verifying OTP:', otp);

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', {
        email,
        otp,
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        // Successfully verified OTP, navigate to login or home page
        navigate('/login');
      } else {
        setErrMsg('Invalid OTP');
      }
    } catch (err) {
      console.log('Error:', err);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Invalid OTP');
      } else {
        navigate('/login');
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };

  return (
    <>
      <Navbar />
      <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>OTP Verification</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Enter Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <button type="button" onClick={sendOTP}>Send OTP</button>

          {isOtpSent && (
            <>
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
            </>
          )}
        </form>
      </section>
    </>
  );
};

export default OtpPage;