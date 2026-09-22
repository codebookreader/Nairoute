import React from 'react'
import naiLogo from'./images/Nairoute.png'

const Footer = () => {
  return (
    <div>
        <footer>
        <div className='NaiFooter'>
            <div>
            <img className= "Nailogo" src = {naiLogo} alt = 'Logo'></img>   
                <h2>Nairoute</h2>
            </div>
            <div className='Naifooterchild'>
                <h1>On</h1>
            </div>
            <div className='Naifooterchild'>
                <h1>The</h1>
            </div>
            <div className='Naifooterchild'>
                <h1>Go</h1>
            </div>
            
        </div>
        </footer>
    </div>
  )
}

export default Footer