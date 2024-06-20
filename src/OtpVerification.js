import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const OtpVerification = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef(null);

    console.log("Location state:", state);  // Log the state to verify it's being passed

    // Ensure state is defined to avoid errors
    if (!state) {
        return <p>State is missing. Please start the registration process again.</p>;
    }

    const { email, firstName, secondName, phoneNumber, password } = state;

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
                // Proceed to insert the user data into the database upon successful OTP verification
                const registerResponse = await axios.post('http://localhost:5000/register-final', {
                    email,
                    firstName,
                    secondName,
                    phoneNumber,
                    password
                });

                console.log('Register Response:', registerResponse.data);
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
                setErrMsg('Verification Failed');
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
            </section>
        </>
    );
};

export default OtpVerification;