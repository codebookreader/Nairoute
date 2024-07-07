import React from 'react'

const Adminpage = () => {
  return (
    <div>
      <h1>Admin Page</h1> 
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul>
                <li><a href="/statistics">Statistics</a></li>
                <li><a href="/managecommuters">Commuters</a></li>
                <li><a href="/managedrivers">Drivers</a></li>               
            </ul>
        </nav>
    </div>
  )
}

export default Adminpage