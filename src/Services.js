import React from 'react'
import Navbar from './Navbar'
import commuter from './commuter.jpg'

const Services = () => {
  return (
    <div>
        <Navbar/>
        <h1>Our Services</h1>
        <br></br>
        <h2>We are confident in offering the following services <br></br>to our dear customers</h2>
        <br></br>
        <h3>Commuter Services</h3>
        <div className='services'>
            <div className = 'servicedetails'>
              <p>With our wide range of registered vehicles,feel free to book one in any station of your choice.View the available routes to your destination right a the palm of your hands.
                Nairoute guarantees you a safe journey upto your stop anytime anywhere in Nairobi.
              </p>
       
            </div>      
            <div>
            <img src = {commuter} alt = 'commuter'></img>   
            </div>
        </div>
        <br></br>
        <h3>Driver Services</h3>
        <div className='services'>
          <div>
              <p>image</p>  
            </div>
            <div className = 'servicedetails'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
       
            </div>     
            
        </div>
        <br></br>
        <h3>Payment Options</h3>
        <div className='services'>
            <div className = 'servicedetails'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
       
            </div>      
            <div>
             <img src = {commuter} alt = 'commuter'></img> 
            </div>
        </div>
    </div>
  )
}

export default Services