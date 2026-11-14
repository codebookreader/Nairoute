import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from './Footer'
import {signOut,auth} from './firebase'

const Dashboard = () => {
  const [displayName, setdisplayName] = useState('')
  const[origin,setOrigin] = useState('')
  const[destination,setDestination] = useState('')
  const[errMsg,setErrMsg] = useState('')
  const[routes,setRoutes] = useState([])
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
    const handleSearch=async(e)=>{
      e.preventDefault();
      setErrMsg("");
      if(!origin.trim() || !destination.trim()){
        setErrMsg("Please enter both origin and destination");
      }
      setIsLoading(true);
      try {
        const result  =await axios.get('/api/routes',{
          params:{origin:origin.trim(),destination:destination.trim()}
        });
        if(result.data.sucess && result.data.data.length > 0){
          setRoutes(result.data.data);
        }else{
          setRoutes([]);
          setErrMsg("No direct routes found for this journey");
        }
      } catch (error) {
        console.error("Routes error:",error.message);
        setErrMsg("No routes available for chosen route");
        }
        finally{
          setIsLoading(false);
        }
    };
    const handleShowAll=async(e)=>{
    setErrMsg('');
    setIsLoading(true);
    try {
      const res = await axios.get('/api/routes');
      if (res.data.success) {
        setRoutes(res.data.data);
      }
    } catch (err) {
      setRoutes([
        { routeid: 1, source: 'CBD', destination: 'Westlands', distance: 8, stops: 'Museum Hill, Parklands', cost: 50 },
        { routeid: 2, source: 'CBD', destination: 'Ngong Road', distance: 14, stops: 'KNH, Adams Arcade', cost: 70 },
        { routeid: 3, source: 'Kibera', destination: 'Lavington', distance: 11, stops: 'Valley Arcade, Riverside', cost: 60 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBookRoute=()=>{
    console.log("I am here bruh");
    
  };
    const handleLogout = () => {};
  return (
    <>
     <div  className =' w-75'style={{minHeight:"100vh",backgroundColor:'#0E1712'}}>
      <div className='p-2 d-flex justify-content-center' style={{backgroundColor:'#98FF98'}}>
    <Navbar/>
    </div>
      <div className="container">
        {/* Welcome Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h2 className="fw-bold mb-1" style={{color:'#d5e6db'}}>Commuter Dashboard</h2>
            <p className="mb-0" style={{color:'#d5e6db'}}>Logged in as: <span className="fw-semibold text-primary">{displayName}</span></p>
          </div>
          <button className="btn btn-outline-danger btn-sm px-3" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
          <div className='card shadow-sm  p-4 border-0' style={{minHeight:'220px'}}>
            <h4 className='text-center'>Where would you like to go?</h4>
            <p className="text-muted small mb-2">Search real-time Nairobi shuttle & bus routes, compare fares, and reserve your seat.</p>
             <p className="text-muted small ">Click "View all Routes" to see all available routes.</p>
             {errMsg && <div className="alert alert-warning py-2 small">{errMsg}</div>}
              <form onSubmit={handleSearch} className='p-2'>
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
          
          {routes.length > 0 && (
          <div>
            <h4 className="fw-bold mb-3">Available Routes ({routes.length})</h4>
            <div className="row g-3">
              {routes.map((route, idx) => (
                <div key={idx} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100 p-3 hover-shadow transition">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        Route #{route.routeid || idx + 1}
                      </span>
                      <span className="fw-bold text-success fs-5">KES {route.cost || 50}</span>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">
                      {route.source} &rarr; {route.destination}
                    </h5>
                    <p className="text-muted small mb-2">
                      <strong>Stops:</strong> {route.stops || 'Direct Express'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                      <span className="text-secondary small">{route.distance || '10'} km</span>
                      <button 
                        className="btn btn-sm btn-warning fw-bold px-3"
                        onClick={() => handleBookRoute(route)}
                      >
                        Select Seats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>
         </div>
      </div>
    </>
  )
}

export default Dashboard