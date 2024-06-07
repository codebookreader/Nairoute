import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Include Font Awesome CSS

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [commuterid, setCommuterid] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pwd !== matchPwd) {
            setErrMsg("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/register', {
                commuterid,
                firstName,
                lastName,
                email,
                phoneNo,
                username: user,
                password: pwd
            });
            console.log(response);
            setSuccess(true);
            setCommuterid('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhoneNo('');
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
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
                        <label htmlFor="commuterid">Commuter ID:</label>
                        <input
                            type="text"
                            id="commuterid"
                            autoComplete="off"
                            onChange={(e) => setCommuterid(e.target.value)}
                            value={commuterid}
                            required
                        />

                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            autoComplete="off"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                        />

                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            autoComplete="off"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
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

                        <label htmlFor="phoneNo">Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNo"
                            autoComplete="off"
                            onChange={(e) => setPhoneNo(e.target.value)}
                            value={phoneNo}
                            required
                        />

                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
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

                        <button>Sign Up</button>
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