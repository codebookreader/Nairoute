import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

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
  return (
    <div>
        <h1>This is the dashboard</h1>
        <p>Welcome {displayName}</p>
    </div>
  )
}

export default Dashboard