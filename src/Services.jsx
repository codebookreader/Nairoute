import React from 'react'
import Navbar from './Navbar'
import commuter from './images/commuter.jpg'
import driver from './images/driver.jpg'
import payment from './images/payment.jpg'

const Services = () => {
  return (
    <div className='main'>
      <Navbar/>
      <h1>Our Services</h1>
      <br></br>
      <h2>We are confident in offering the following services <br></br>to our dear customers</h2>
      <br></br>
      <h3>Commuter Services</h3>
      <div className='services' style={{marginRight:'100px',marginLeft:'50px'}}>
        <div className='servicedetails'>
          <p style={{width:'150%'}}>With our wide range of registered vehicles, feel free to book one in any station of your choice. View the available routes to your destination right at the palm of your hands. Nairoute guarantees you a safe journey up to your stop anytime anywhere in Nairobi.</p>
        </div>      
        <div>
          <img src={commuter} alt='commuter'></img>   
        </div>
      </div>
      <br></br>
      <h3>Driver Services</h3>
      <div className='services'style={{marginRight:'100px',marginLeft:'50px'}}>
        <div>
          <img src={driver} alt='driver'></img> 
        </div>
        <div className='servicedetails'>
          <p>Are you a licensed driver? Feel free to join us in providing a wonderful travel experience to our customers. You can now apply to be a Nairoute driver. Register your vehicle and confirm passenger payments before the journey starts.</p>
        </div>     
      </div>
      <br></br>
      <h3>Payment Options</h3>
      <div className='services'style={{marginRight:'100px',marginLeft:'50px'}}>
        <div className='servicedetails'>
          <p>Choose from our various payment options, whether it's cash, bank card. Enjoy our seamless and secure transactions for faster and safe payments. Experience a hassle-free travel.</p>
        </div>      
        <div>
          <img src={payment} alt='payment'></img> 
        </div>
      </div>
    </div>
  )
}

export default Services