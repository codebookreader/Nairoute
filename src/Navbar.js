import React from 'react'

const Navbar = () => {
  return (
	  <nav className="navbar navbar-expand-lg navbar-light">
      <a className="navbar-brand" href="/">Nairoute</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/services">Services</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">Contact</a>
          </li>
        </ul>
        <a href="/login" className="btn bg-warning rounded-pill">Login</a>
      </div>
    </nav>
  )
}

export default Navbar
