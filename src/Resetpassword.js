import React from 'react'
import { useState } from 'react'
import axios from 'axios'
const Resetpassword = () => {
    const [email,setEmail] = useState('')
    const [phoneNumber,setphoneNumber] = useState('')
    function handleSubmit (event){
        event.preventDefault();
        axios.post('http://localhost:5000/resetpassword',{email,phoneNumber})
        .then(res => console.log(res))
        .catch(err =>console.log(err))
      }
  return (
     <div>
        <div className='intro'>
        <h1>Welcome to the reset password page</h1>
        <p>We will send you an OTP to confirm account ownership</p>
        </div>
        <h2>Enter the details below</h2>
        <form onSubmit={handleSubmit}>
        <label htmlFor="email">email</label>
        <input
            type="text"
            id="email"
            autoComplete="off"
            value = {email}
            onChange={(e)=>setEmail(e.target.value)}
            required
        />
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
            type="number"
            id="phoneNumber"
            autoComplete="off"
            value = {phoneNumber}
            onChange={(e)=>setphoneNumber(e.target.value)}
            required
        />
        <button>Submit</button>
        </form>
     </div>
  )
}

export default Resetpassword