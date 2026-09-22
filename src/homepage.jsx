import React from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

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
      <div>
        <Navbar />
      </div>
      <div className="container text-center mt-5">
        <h1 className="display-4">
          Welcome to Nairoute. <span className="text-primary">Need a ride?</span>
        </h1>
        <br />
        <h2 className="my-4">Nairoute is your driver!</h2>
        <a href="/register" className="btn rounded-pill btn-lg mx-2 custom-bg bg-warning">Go to Register</a>
        <button onClick={handleLockScreen} className="btn btn-secondary btn-lg mx-2" style={{ width: '200px' }}>
          Lock Screen
        </button>
        <div className="mt-4">

        </div>
      </div>
      <a href="/adminlogin">Admin Login</a>
    </>
  );
};

export default Home;
