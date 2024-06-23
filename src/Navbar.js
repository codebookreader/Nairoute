import React from 'react'
import naiLogo from'./images/Nairoute.png'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const homenav=()=>{
    navigate('/login')
  }
  return (
    <div>
      <div className = 'Hero'>
    <div className="hero">
        <nav>
        <img className= "Nailogo" src = {naiLogo} alt = 'Logo'></img>
            <ul className='navChild'>
                <li><a href="/">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <button className= "navChild"type="button" onClick = {homenav}>Login</button>
        </nav>
    </div>
    </div>
    </div>
  )
}

export default Navbar