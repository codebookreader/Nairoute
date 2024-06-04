import React from 'react'
import { useState } from 'react'
import axios from 'axios'
const Login = () => {
  const [password,setPassword] = useState("") 
  const [email,setemail] = useState("")
  function handleSubmit (event){
    event.preventDefault();
    axios.post('http://localhost:5000/login',{email,password})
    .then(res => console.log(res))
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
        <button>Sign in</button>
    </form>

        <a href="/resetpassword">Forgot password?</a>
       
        </section>
  )
}

export default Login