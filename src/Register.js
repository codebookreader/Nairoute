import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Include Font Awesome CSS

const Register = () => {
    const userRef = useRef(null);
    const errRef = useRef(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form is being submitted');  // Log form submission
        console.log('Form data:', { email, firstName, secondName, phoneNumber, password: pwd });

        try {
            const response = await axios.post('http://localhost:5000/register', {
                email,
                firstName,
                secondName,
                phoneNumber,
                password: pwd,
            });
            console.log('Response:', response);
            setSuccess(true);
            setEmail('');
            setFirstName('');
            setSecondName('');
            setPhoneNumber('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            console.log('Error:', err);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
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
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>
                        Register 
                        <button type="button" style={{ marginLeft: "10px", border: "none", background: "none" }}>
                            <i className="fas fa-lock"></i>
                        </button>
                    </h1>
                    <form onSubmit={handleSubmit}>
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
            )}
        </>
    );
};

export default Register;