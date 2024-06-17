import React from 'react';
import Navbar from './Navbar';

const Home = () => {
  return (
    <>
    <div>
    <Navbar/>
    </div>
    <div>
      <h1>Welcome to Nairoute.<span>Need a ride?</span></h1>
      <br></br>
      <h2>Nairoute is your driver!</h2>
      <a href="/register">Go to Register</a>
      
    </div>
    </>
  );
}

export default Home;