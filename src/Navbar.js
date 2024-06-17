import React from 'react'

const Navbar = () => {
  return (
    <div>
    <div className="hero">
        <nav>
            <h2 className="logo">Nairoute</h2>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <button type="button"  >Login</button>
        </nav>
    </div>
    </div>
  )
}

export default Navbar