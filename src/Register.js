import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Register = () => {
  const userRef = useRef(null);
  const errRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pwd, setPwd] = useState('');
  const [matchPwd, setMatchPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/register', {
        email,
        firstName,
        secondName,
        phoneNumber,
        password: pwd,
      });

      if (response.data.message === 'Registration successful, please check your email for the OTP') {
        navigate('/otp-verification', { state: { email, firstName, secondName, phoneNumber, password: pwd } });
      } else {
        setErrMsg(response.data.message || 'Registration Failed');
        if (errRef.current) {
          errRef.current.focus();
        }
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Email already registered');
      } else if (err.response?.status === 400) {
        setErrMsg('All fields are required');
      } else {
        setErrMsg('Registration Failed');
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
        <h1>Register</h1>
        <form onSubmit={handleRegistration}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            autoComplete="off"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            required
            ref={userRef}
          />

          <label htmlFor="secondName">Second Name:</label>
          <input
            type="text"
            id="secondName"
            autoComplete="off"
            onChange={(e) => setSecondName(e.target.value)}
            value={secondName}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            autoComplete="off"
            onChange={(e) => setPhoneNumber(e.target.value)}
            value={phoneNumber}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />

          <label htmlFor="confirm_pwd">Confirm Password:</label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
          />

          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already registered?<br />
          <span className="line">
            <a href="/login">Sign In</a>
          </span>
        </p>
      </section>
    </>
  );
};

export default Register;