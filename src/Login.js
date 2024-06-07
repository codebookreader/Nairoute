import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const Login = () => {

  const [password,setPassword] = useState("") 
  const [email,setemail] = useState("")
  const [errMessage,setErrMessage] = useState("")
  const navigate = useNavigate()

  axios.defaults.withCredentials = true

  useEffect(()=>{
    axios.get('http://localhost:5000/dashboard')
    .then(res=>{
        if (res.data.valid){
          navigate('/dashboard')
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
        navigate('/dashboard')
      }
      else{
        setErrMessage(res.data.message)
      }
    })
    .catch(err =>console.log(err))
  }
  return (
  <section>
    <h1>Login</h1>
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
            type="text"
            id="password"
            autoComplete="off"
            value = {password}
            onChange={(e)=>setPassword(e.target.value)}
            required
        />
        {errMessage && <p style={{ color: 'red' }}>{errMessage}</p>}
        <button>Sign in</button>
    </form>

        <a href="/resetpassword">Forgot password?</a>
       
        </section>
  )
}

export default Login