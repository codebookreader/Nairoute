import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'

const Dashboard = () => {
  const [displayName, setdisplayName] = useState('')
  const navigate = useNavigate()
  axios.defaults.withCredentials = true
    useEffect(()=>{
        axios.get('http://localhost:5000/dashboard')
        .then(res=>{
            if (res.data.valid){
              setdisplayName(res.data.email)
            }
            else{
              navigate('/login')
            }
        })
        .catch(err => console.log(err))
    },[])
    const handleLogout = () => {
      axios.post('http://localhost:5000/logout')
        .then(res => {
          if (res.data.success) {
            navigate('/login');
          } else {
            console.log('Logout failed:', res.data.message);
          }
        })
        .catch(err => console.log('Logout error:', err));
    };
  return (
    <div>
      <Navbar/>
        <h1>This is the dashboard</h1>
        <p>Welcome {displayName}</p>
        <button className='btn btn-danger' onClick ={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard