import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from './Navbar';

const DriverLogin = () => {

  const [password,setPassword] = useState("") 
  const [driverEmail,setdriverEmail] = useState("")
  const [errMessage,setErrMessage] = useState("")
  const [recaptchaVal,setRecaptchaVal] = useState(null)
  const navigate = useNavigate()

  axios.defaults.withCredentials = true

  useEffect(()=>{
    axios.get('http://localhost:5000/driverdashboard')
    .then(res=>{
        if (res.data.valid){
          navigate('/driverdashboard')
        }
        else{
          navigate('/driverlogin')
        }
    })
    .catch(err => console.log(err))
},[])

  function handleSubmit (event){
    event.preventDefault();
    axios.post('http://localhost:5000/driverlogin',{driverEmail,password})
    .then(res =>{
      if (res.data.Login){
        navigate('/driverdashboard')
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
  <section>
    <h1>Login as a driver </h1>
    <form onSubmit = {handleSubmit}>
        <label htmlFor="driverEmail">Email</label>
        <input
            type="text"
            id="driverEmail"
            autoComplete="off"
            value = {driverEmail}
            onChange={(e)=>setdriverEmail(e.target.value)}
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

export default DriverLogin