import React, { useState } from 'react';
import Registerdriver from './Registerdriver';

const Hero = ({ title = "Need a ride?", subtitle = "Nairoute is your driver!" }) => {
  const [book, setBook] = useState(true);

  return (
    <div className="hero">
      <h1>{title} <span>{subtitle}</span></h1>
      <button id="book" onClick={() => setBook(prevState => !prevState)}>Book Now</button>
      {!book && <Registerdriver/>}
    </div>
  );
}

export default Hero;
