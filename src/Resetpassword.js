import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Resetpassword = () => {
  //confirm account existence in database
    const [email,setEmail] = useState('')
    const [phoneNumber,setphoneNumber] = useState('')
    const [errMessage,setErrMessage] = useState('')

  //set up new password
    const [newPasswordForm,setNewPasswordForm] = useState(false)
    const [newPassword,setNewPassword] = useState('')
    const [confirmNewPassword,setConfirmNewPassword] = useState('')
    const [successMessage,setSuccessMessage] = useState('')
    const navigate = useNavigate()

    //send phone number for otp
     const resetPassword =(event)=>{
      event.preventDefault()
      axios.post('http://localhost:5000/resetpassword',{email,phoneNumber})
      .then(res=>{
        if(res.data.Success){
          setNewPasswordForm(true)
        }
        else{
          setErrMessage(res.data.message)
        }
      })
      .catch(err=>console.log(err))
     }
    
      //set new password on successful verification
      const  handleNewPasswordSubmit = (event)=>{
        event.preventDefault();
        if(newPassword === confirmNewPassword){
            axios.post('http://localhost:5000/setnewpassword',{email,newPassword})
            .then(res =>{
              if(res.data.Success){
                setSuccessMessage(res.data.message)
                setTimeout(() => {
                  navigate('/login');
                }, 3000);
              }
              else{
                setErrMessage(res.data.message)
              }
            })
            .catch(err =>console.log(err))
            }
            
        else{
            setErrMessage("The passwords do not match")
        }
        
      }
  return (
     <div>
        <div className='intro'>
        <h1>Welcome to the reset password page</h1>
        <h2>Enter the details below</h2>
        </div>
        {!newPasswordForm &&(
        <form onSubmit={resetPassword}>
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
        {errMessage && <p style={{ color: 'red' }}>{errMessage}</p>}
        <button>Submit</button>
        </form>)}
        {newPasswordForm && (
        <div>
          <h2>Set New Password</h2>
          <form onSubmit={handleNewPasswordSubmit}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            {errMessage && <p style={{ color: 'red' }}>{errMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit">Set Password</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Resetpassword