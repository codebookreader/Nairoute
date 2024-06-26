import React from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLockScreen = () => {
    navigate('/lockscreen');
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
        <button onClick={handleLockScreen} className="btn btn-secondary btn-lg mx-2">Lock Screen</button>
      </div>
      <a href = '/adminpage'>Admin Login</a>
    </>
  );
};

export default Home;
