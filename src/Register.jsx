import { useState, useEffect } from "react";
import { useNavigate,Link } from 'react-router-dom';
import Navbar from './Navbar';
import {
    auth,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword
} from "./firebase"
import { syncUserWithBackend } from "./utils/syncUserWithBackend";//

const Register = () => {
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState('');
    const [role,setRole]  =useState('commuter');
    const [email, setEmail] = useState('');
    const [license_number,setLicenseNumber] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading,setIsLoading] = useState(false);

    const handleEmailRegister = async(e)=>{
        e.preventDefault();
        setErrMsg("");

        if(password != confirmPassword){
            setErrMsg("Passwords do not match!");
            return;
        }

        if(role === "driver" && !license_number.trim()){
            setErrMsg("Driver license number mandatory");
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            const syncData = await syncUserWithBackend(idToken,role,license_number);

            console.log('Postgresql sync results: ',syncData);
            

            localStorage.setItem("token",idToken);
            localStorage.setItem("userEmail",user.email);
            localStorage.setItem("userRole",role);

            if(role === "driver"){
                localStorage.setItem("licenseNumber",license_number);
                navigate("/driverdashboard");
            }else{
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Firebase registration error",error);
            if(error.code === "auth/email-already-in-use"){
                setErrMsg("Email is already registered,please log in.")
            }
            else if(error.code === "auth/weak-password"){
                setErrMsg("Password should be atleast 6 characters,include special characters");
            }
            else{
                setErrMsg(`Registration failed: ${error.message}`);
            }
            
            
        }
        finally{
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async()=>{
        setErrMsg("");
        setIsLoading(true);

        try {
            const result = await signInWithPopup(auth,googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken();
            const syncData = await syncUserWithBackend(idToken,role,license_number);

            console.log('Postgresql sync results: ',syncData);

            localStorage.setItem("token",idToken);
            localStorage.setItem("userEmail",user.email);
            localStorage.setItem("userRole",role);

            if(role === "driver"){
                navigate("/complete-driver-profile");
            }
            else{
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Google auth error",error);
            if(error.code === "auth/pop-up-closed-by-user"){
                setErrMsg("Google sign-in failed")
            }
                        
        }
        finally{
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center" style={{minHeight:"80vh"}}>
                <div className="card shadow-sm p-4" style={{maxWidth:"420px",width:"100%",borderRadius:"12px"}}>
                    <h2 className="text-center mb-3">Create an Account</h2>
                    <div>
                        <div className="btn-group w-100 mb-2" role="group ">
                        <button 
                        type="button"
                        className={`btn ${role === "commuter" ? "btn-primary": "btn-outline-primary"}`}
                        onClick={()=>{setRole("commuter");setErrMsg("")}}
                        >Commuter</button>
                        <button 
                        type="button"
                        className={`btn ${role==="driver" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={()=>{setRole("driver");setErrMsg("")}}
                        >Driver</button>
                        </div>
                        {errMsg && <div>{errMsg}</div>}
                        <button 
                        type="button"
                        className="btn btn-outline-dark w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        >Continue with Google</button>
                        <div className="text-center text-muted ">
                            <small>- or with email -</small>
                        </div>
                        <form onSubmit={handleEmailRegister}>
                            <div className="mb-2">
                                <label className="form-label">Email address</label>
                                <input
                                type = "email"
                                className = "form-control"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                required/>
                            </div>
                            {role === "driver" && (
                                <div className="mb-2">
                                    <label className="form-label" >Driver License Number</label>
                                    <input 
                                    type="text"
                                    className="form-control"
                                    placeholder="DL-12345678"
                                    value={license_number}
                                    onChange={(e)=> setLicenseNumber(e.target.value)}
                                    requried  />
                                </div>)}
                            <div className="mb3">
                                <label className="form-label">password</label>
                                <input 
                                type="password"
                                className="form-control"
                                placeholder="atleast 6 characters"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                requried
                                 />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Confirm password</label>
                                <input 
                                type="password"
                                className="form-control"
                                placeholder="repeat password"
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                requried
                                 />
                            </div>
                            <button 
                            type="submit"
                            className="btn btn-warning w-100 fw-bold"
                            >
                                {loading ? "Creating account...": `Register as ${role === "driver" ? "Driver" : "Commuter"}` }
                            </button>
                        </form>
                        <div  className="text-center mt-3" >
                            <small>Already have an account? <Link to= "/login">Sign In</Link></small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
