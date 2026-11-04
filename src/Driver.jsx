import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Register = () => {
    const userRef = useRef(null);
    const errRef = useRef(null);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [first_name, setFirstName] = useState('');
    const [second_name, setSecondName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [license_number, setLicense] = useState('');
    const [password, setPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [otpForm, setOtpForm] = useState(false);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');


    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    const handleRegistration = async (e) => {
        e.preventDefault();
        console.log('Form data:', { email, first_name, second_name, phone_number, license_number, password: password });

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(password)) {
            setErrMsg('Password must contain at least one capital letter, one symbol, and be at least 8 characters long.');
            return;
        }

        try {
            const response = await axios.post('api/drivers/register', {
                email,
                first_name,
                second_name,
                phone_number,
                license_number,
                password: password,
            });

            if (response.status === 201) {
                navigate('/otppage', { state: { email } });
            } else {
                setErrMsg(response.data.message || 'Registration Failed');
                if (errRef.current) {
                    errRef.current.focus();
                }
            }
        } catch (err) {
            console.log('Error:', err);
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
      // Send OTP
  const sendOtp = async () => {
    try {
      const response = await axios.post('/api/drivers/send-otp', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error sending OTP');
    }
  };
     // Verify OTP
  const verifyOtp = async () => {
    try {
      const response = await axios.post('/api/drivers/verify-otp', { email, otp });
      setMessage('OTP validated successfully');
      setTimeout(() => {
        setOtpForm(false);
        setMessage('Sucessfully registered! Redirecting to login page...');
        navigate('/driverlogin');
      }, 1000);
    } catch (error) {
      setMessage('Invalid OTP');
    }
  };

    return (
        <>
            <Navbar />
            <section style={{maxWidth:'600px'}}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Register as a driver</h1>
                <form onSubmit={handleRegistration}>
                    <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{display:'flex',flexDirection:'column',marginRight:'20px'}}>
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        type="text"
                        id="first_name"
                        autoComplete="off"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={first_name}
                        required
                        ref={userRef}
                    />

                    <label htmlFor="second_name">Second Name:</label>
                    <input
                        type="text"
                        id="second_name"
                        autoComplete="off"
                        onChange={(e) => setSecondName(e.target.value)}
                        value={second_name}
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

                    <label htmlFor="phone_number">Phone Number:</label>
                    <input
                        type="text"
                        id="phone_number"
                        autoComplete="off"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phone_number}
                        required
                    />
                     </div>
                     <div style={{display:'flex',flexDirection:'column'}}>
                    <label htmlFor="license_number">DL Number:</label>
                    <input
                        type="text"
                        id="license_number"
                        autoComplete="off"
                        onChange={(e) => setLicense(e.target.value)}
                        value={license_number}
                        required
                    />
                
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={password}
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
                   
                    
                    </div>
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
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