import { useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { syncUserWithBackend } from './utils/syncUserWithBackend';
import Navbar from './Navbar';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from './firebase'

const Login = () => {
  const navigate = useNavigate()

  const [role,setRole] = useState("commuter");
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [errMsg,setErrMessage] = useState("");
  const [loading,setIsLoading] = useState(false);

  const handleEmailSignIn = async(e)=>{
    e.preventDefault();
    setErrMessage("");

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const syncUser = await syncUserWithBackend(idToken,role);

      localStorage.setItem("token",idToken);
      localStorage.setItem("userEmail",user.email);
      localStorage.setItem("role",role);

      if(role==="commuter"){
        navigate("/dashboard");
      }else{
        navigate("/driverdashboard");
      }
    } catch (error) {
      if(error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code == "auth/invalid-credential"
      ){
        setErrMessage("Invalid email or password.");
      }else if(error.code === "auth/too-many-attempts"){
        setErrMessage("Too many failed attempts. Please try again later");
      }
      else{
        console.error("Login failed: ",error.message);
        setErrMessage("Login failed");
        
      }
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async()=>{
    setErrMessage("");
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth,googleProvider);
      const user = result.user;
      const idToken  = await user.getIdToken();
      const syncData = await syncUserWithBackend(idToken,role)

      
      localStorage.setItem("userEmail",user.email)
      localStorage.setItem("token",idToken);
      localStorage.setItem("role",role);

      if(role === 'driver'){
        navigate('/driverdashboard');
      }
      else{
        navigate('/dashboard');
      }
    } catch (error) {
      if(error.code !== "auth/popup-closed-by-user"){
        console.error("Google sign in error", error.message);
        setErrMessage("Google sign in error");
      } 
      setErrMessage("Sign in stopped by user")
    }
    finally{
      setIsLoading(false);
    }
  };
  
  return (
    <>
    <div  className =' w-75'style={{minHeight:"100vh",backgroundColor:'#0E1712'}}>
      <div className='p-2 d-flex justify-content-center' style={{backgroundColor:'#98FF98'}}>
    <Navbar/>
    </div>
    <div className="d-flex justify-content-center">
      <div className='card shadow-sm p-4 ' style={{maxWidth:"420px",width:"100%",borderRadius:"12px",backgroundColor:'#16241C',border:'#263D30'}}>
        <h2 className='text-center mt-2 mb-3' style={{color:'#d5e6db'}}>Welcome back</h2>
        <div className='btn-group w-100 mb-2' role='group'>
          <button
          type='button'
          className={`btn ${role === 'commuter' ? 'btn-primary':'btn-outline-primary'}`}
          onClick={()=>{setRole("commuter");setErrMessage("")}}
          >Commuter</button>
          <button
          type = 'button'
          className={`btn ${role === 'driver' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={()=>{setRole("driver");setErrMessage("")}}
          >Driver</button>
        </div>
          {errMsg && <div className="alert alert-danger py-2">{errMsg}</div>}
        <button
        className='btn btn-outline-dark w-100 d-flex justify-content-center align-items-center mb-2 '
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{color:'#d5e6db'}}
        >Sign in with Google</button>
        <div className='text-center text-muted '><small   style={{color:'#d5e6db'}}>-or with email-</small></div>
        <form onSubmit={handleEmailSignIn} className='p-2'>
          <div className='mb-2'>
            <label className='form-label'>Email Address</label>
            <input
            type="email"
            className="form-control"
            value={email}
            placeholder='email@example.com'
            onChange={(e)=>setEmail(e.target.value)}
            required
            />
          </div>
          <div >
            <label className='form-label'>Password</label>
            <input
            type='password'
            className='form-control'
            value={password}
            placeholder='password123'
            onChange={(e)=>setPassword(e.target.value)}
            required
            />
          </div>
          <Link to = "/resetpassword" style={{fontSize:'0.95rem'}}>forgot password?</Link>
          <button
          type='submit'
          className='btn fw-bold w-100 btn-warning mt-2 mb-2'
          >{loading ? "Signin in" : `Sign in as ${role === "driver" ? "Driver" : "Commuter"}`}</button>
        </form>
        <div className="text-center mt-1 mb-3"><small style={{color:'#d5e6db'}}>Dont have an account? <Link to= "/register">Create one</Link></small></div>
      </div>
    </div>
    </div>
    </>
  )
}

export default Login