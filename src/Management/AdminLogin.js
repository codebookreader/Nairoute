import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {

  const [password,setPassword] = useState("") 
  const [email,setemail] = useState("")
  const [recaptchaVal,setRecaptchaVal] = useState(null)
  const [errMessage,setErrMessage] = useState("")
  const navigate = useNavigate()

  axios.defaults.withCredentials = true

  useEffect(()=>{
    axios.get('http://localhost:5000/adminpage')
    .then(res=>{
        if (res.data.valid){
          navigate('/adminpage')
        }
        else{
          navigate('/adminlogin')
        }
    })
    .catch(err => console.log(err))
},[])

  function handleSubmit (event){
    event.preventDefault();
    axios.post('http://localhost:5000/adminlogin',{email,password})
    .then(res =>{
      if (res.data.Login){
        navigate('/adminpage')
      }
      else{
        setErrMessage(res.data.message)
        setRecaptchaVal(null)
      }
    })
    .catch(err =>console.log(err))
  }
  return (
    <div className='main'>
      <Navbar/>
  <section>
    <h1>Login as an administrator</h1>
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