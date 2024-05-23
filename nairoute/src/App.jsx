import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {


  return (
    
    <>
      <Navbar/> 
      <Hero/>
      

      <div className="about">
        <h1>About Us</h1>
        <p>
          Public transport should be available and affordable to everyone at any time.
          Nairoute aims at achieving this goal through our wide range of route options
          and favorable pricing.
        </p>
      </div>
    </>
  );
}

export default App
