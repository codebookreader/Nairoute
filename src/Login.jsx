import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from './Navbar';

const Login = () => {

  const [password,setPassword] = useState("") 
  const [email,setemail] = useState("")
  const [errMessage,setErrMessage] = useState("")
  const [recaptchaVal,setRecaptchaVal] = useState(null)
  const navigate = useNavigate()

  axios.defaults.withCredentials = true

  useEffect(()=>{
    axios.get('http://localhost:5000/seatpick')
    .then(res=>{
        if (res.data.valid){
          navigate('/seatpick')
        }
        else{
          navigate('/login')
        }
    })
    .catch(err => console.log(err))
},[])

  function handleSubmit (event){
    event.preventDefault();
    axios.post('http://localhost:5000/login',{email,password})
    .then(res =>{
      if (res.data.Login){
        navigate('/seatpick')
      }
      else{
        setErrMessage(res.data.message)
      }
    })
    .catch(err =>console.log(err))
  }
  return (
    <div className='main'>
      <Navbar/>
      <p>Are you are driver?<a href = 'driverlogin'>Click here</a></p>
  <section>
    <h1>Login as a commuter</h1>
    <form onSubmit = {handleSubmit}>
        <label htmlFor="email">email</label>
        <input
            type="text"
            id="email"
            autoComplete="off"
            value = {email}
            onChange={(e)=>setemail(e.target.value)}
            required
        />
        <label htmlFor="password">Password</label>
        <input
            type="password"
            id="password"
            autoComplete="off"
            value = {password}
            onChange={(e)=>setPassword(e.target.value)}
            required
        />
        <ReCAPTCHA
    sitekey="6LdyMwUqAAAAAH7QR9cmLJC2Y6NmIuluuOziJXgB"
    onChange={(val)=>setRecaptchaVal(val)}
  />
        {errMessage && <p style={{ color: 'red' }}>{errMessage}</p>}
        <button disabled = {!recaptchaVal} >Sign in</button>
    </form>

        <a href="/resetpassword">Forgot password?</a>
       
        </section>
        </div>
  )
}

export default Login