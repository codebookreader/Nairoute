import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const Adminpage = () => {
  axios.defaults.withCredentials = true
  const [displayName, setdisplayName] = useState('')
  const navigate = useNavigate()
  useEffect(()=>{
    axios.get('http://localhost:5000/adminpage')
    .then(res=>{
        if (res.data.valid){
          setdisplayName(res.data.email)
        }
        else{
          navigate('/adminlogin')
        }
    })
    .catch(err => console.log(err))

    axios.post('http://localhost:5000/api/updateStatus')
    .then(res=>{
        console.log(res.message)
    })
    .catch(err => console.log(err))
},[])

const handleLogout = () => {
  axios.post('http://localhost:5000/logout')
    .then(res => {
      console.log('Server response:', res.data); 
      if (res.data.success) {
        navigate('/adminlogin');
      } else {
        console.log('Logout failed:', res.data.message);
      }
    })
    .catch(err => console.log('Logout error:', err));
}
 
  return (
    <div>
      <h1>Admin Page</h1> 
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul>
                <li><a href="/statistics">Statistics</a></li>
                <li><a href="/managecommuters">Commuters</a></li>
                <li><a href="/managedrivers">Drivers</a></li>               
            </ul>
        </nav>
        <button className='btn btn-danger' onClick ={handleLogout}>Logout</button>
    </div>
  )
}

export default Adminpage