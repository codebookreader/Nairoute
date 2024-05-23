import React from 'react'

const navbar = () => {
  return (
    <div>
        <nav className="navbar">
        <h2 className="logo">Nairoute</h2>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <button id="login">Login</button>
      </nav>
    </div>
  )
}

export default navbar