import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const homenav=()=>{
    navigate('/login')
  }
  return (
    <div>
    <div className="hero">
        <nav>
            <h2 className="logo">Nairoute</h2>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <button type="button" onClick = {homenav}>Login</button>
        </nav>
    </div>
    </div>
  )
}

export default Navbar