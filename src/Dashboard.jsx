import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from './Footer'
import nairobi from './images/nairobi.jpeg'
import {signOut,auth} from './firebase'

const Dashboard = () => {
  const [displayName, setdisplayName] = useState('')
  const[origin,setOrigin] = useState('')
  const[destination,setDestination] = useState('')
  const[errMsg,setErrMsg] = useState('')
  const[showRoutes,setShowRoutes] = useState(false)
  const [loading,setIsLoading] = useState(false);

  const navigate = useNavigate()
    useEffect(()=>{
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole');

      if( !token || !email){
         navigate('/login');
         return;
        }
        
      if(role === 'driver'){
        navigate('/driverdashboard');
        return;
      }
      setdisplayName(email);
    }
    ,[navigate]);
    const handleSearch=(e)=>{};
    const handleShowAll=(e)=>{};
    const handleLogout = () => {};
  return (
    <>
    <div className=" p-4" style={{ minHeight: '100vh', backgroundColor:'#0E1712'  }}>
      <Navbar />
      <div className="container">
        {/* Welcome Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h2 className="fw-bold mb-1">Commuter Dashboard</h2>
            <p className="text-muted mb-0">Logged in as: <span className="fw-semibold text-primary">{displayName}</span></p>
          </div>
          <button className="btn btn-outline-danger btn-sm px-3" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
         <div className="row  mb-5 align-items-center">
          <div className='card shadow-sm  h-100 border-0' style={{minHeight:'220px'}}>
            <h4 className='text-center'>Where would you like to go?</h4>
            <p className="text-muted small mb-2">Search real-time Nairobi shuttle & bus routes, compare fares, and reserve your seat.</p>
             <p className="text-muted small mb-4">Click "View all Routes" to see all available routes.</p>
             {errMsg && <div className="alert alert-warning py-2 small">{errMsg}</div>}
              <form onSubmit={handleSearch}>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">ORIGIN (FROM)</label>
                    <input
                      type="text"
                      className="form-control py-2"
                      placeholder="e.g. CBD, Westlands, Rongai"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">DESTINATION (TO)</label>
                    <input
                      type="text"
                      className="form-control py-2"
                      placeholder="e.g. Lavington, Karen, Kilimani"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                <div className='d-flex justify-content-center gap-3'>
                  <button type="submit" className="btn btn-warning fw-bold px-4 w-25" disabled={loading}>
                    {loading ? 'Searching...' : 'Find Routes'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary px-3 w-25" onClick={handleShowAll} disabled={loading}>
                    View All Routes
                  </button>
                </div>
              </form>
          </div>
          <div className='card shadow-sm  h-100 border-0' style={{minHeight:'220px'}}></div>

         </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard