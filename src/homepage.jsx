import React from 'react';
import Navbar from './Navbar';
import { useNavigate,Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLockScreen = () => {
    navigate('/lockscreen');
  };

  const handleSeatSelection = (vehicleType) => {
    const state = {
      selectedRoute: { routeid: 1, source: 'A', destination: 'B', stops: 'X, Y, Z' },
      vehicleType,
      date: '2023-12-31',
    };
    console.log('Navigating to seat-selection with state:', state); // Add this line to log the state
    navigate('/seat-selection', { state });
  };

  return (
    <>
    <div className="p-4" style={{ minHeight: '100vh', backgroundColor:'#0E1712'  }}>
      <div className=' p-1 d-flex justify-content-center' style={{backgroundColor:'#98FF98'}}>
        <Navbar />
      </div >
      <div className="container text-center mt-5 " >
        <h1 className="display-4" style={{color:'#d5e6db'}}>
          Welcome to Nairoute. <span className="text-primary">Need a ride?</span>
        </h1>
        <br />
        <h2 className="my-4" style={{color:'#d5e6db'}}>Nairoute is your driver!</h2>
        <Link to ="/register" className="btn rounded-pill btn-lg mx-2 " style={{backgroundColor:'#98FF98'}}>Create your account</Link>
        <div className="mt-4">

        </div>
      </div>
      </div>
    </>
  );
};

export default Home;
