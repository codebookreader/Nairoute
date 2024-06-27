import React from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();

  const handleLockScreen = () => {
    navigate('/lockscreen');
  };

  return (
    <>
        <Navbar />
      <div className='main'>
        <h1>Welcome to Nairoute.<span>Need a ride?</span></h1>
        <br />
        <h2>Nairoute is your driver!</h2>
        <a href="/register">Go to Register</a>
        <br></br>
        <button onClick={handleLockScreen}>Lock Screen</button>
      </div>
      <Footer/>
    </>
  );
};

export default Home;