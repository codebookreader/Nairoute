import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from './Footer'
import nairobi from './images/nairobi.jpeg'
import { set } from 'firebase/database'

const Dashboard = () => {
  const [displayName, setdisplayName] = useState('')
  const[origin,setOrigin] = useState('')
  const[destination,setDestination] = useState('')
  const[successMessage,setSuccessMessage] = useState('')
  const[errMessage,setErrMessage] = useState('')
  const[showRoutes,setShowRoutes] = useState(false)
  const[data,setData]=useState([])
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
    const handleSearch=(e)=>{
      e.preventDefault()
      console.log('Searched')
    }
    const handleShowAll=(e)=>{
      e.preventDefault()
      axios.post('http://localhost:5000/showall',{origin,destination})
      .then(res=>{
        console.log('Server response:', res.data);
      if(res.data.success){
        setSuccessMessage(res.data.message)
        setData(res.data.data)
        setShowRoutes(true)

      }
      else{
        setErrMessage(res.data.message)
      }
    })
    .catch(err =>console.log(err))
    }
    const handleLogout = () => {
      axios.post('http://localhost:5000/logout')
        .then(res => {
          console.log('Server response:', res.data); 
          if (res.data.success) {
            navigate('/login');
          } else {
            console.log('Logout failed:', res.data.message);
          }
        })
        .catch(err => console.log('Logout error:', err));
    };
  return (
    <>
    <div className='main'>
      <Navbar/><span>Welcome {displayName}</span>
        <h1>Start your journey here</h1><br></br>
        <div className='DestOrg'>
          <div>
        <h3>Choose your origin and destination to view available transport</h3><br></br>
        <p>For a more advanced search,click Search to select your preferred route ,or Show All to see all vehicles and all routes taken</p>
        <div className='Dash'>
          <form >
          <input
            type="text"
            id="email"
            placeholder='Origin'
            autoComplete="off"
            value = {origin}
            onChange={(e)=>setOrigin(e.target.value)}
            required
        />
        <input
            type="text"
            id="email"
            autoComplete="off"
            placeholder='Destination'
            value = {destination}
            onChange={(e)=>setDestination(e.target.value)}
            required
        />
        <br></br>
        <div className='orgBtn'>
            <button type="button" onClick={handleSearch}>Search</button>
            <button type="button" onClick={handleShowAll}>Show All</button>
          </div>
          </form>
          </div>
          {errMessage && <p style={{ color: 'red' }}>{errMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          </div >
          <div>
            <img src = {nairobi} alt='commuter'></img>
          </div>
          </div>
          {showRoutes &&(
            <div>
              <h2>Routes</h2>
              <table>
                <thead>
                <tr>
                  <th>Route</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Distance</th>
                </tr>
                </thead>
                <tbody>
                  {data.map((item,index)=>{
                    <tr key = {index}>
                      <td>{item.routeNumber}</td>
                      <td>{item.startLocation}</td>
                      <td>{item.endLocation}</td>
                      <td>{item.distance}</td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          )}
        <button className='btn btn-danger' onClick ={handleLogout}>Logout</button>
        
    </div>
    <Footer/>
    </>
  )
}

export default Dashboard