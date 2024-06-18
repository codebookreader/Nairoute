import React from 'react'
import Navbar from './Navbar'

const Services = () => {
  return (
    <div>
        <Navbar/>
        <h1>This is the services page</h1>
        <h3>Commuter</h3>
        <div className='commuter'>
            <div className = 'commuterdetails'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
       
            </div>      
            <div>
             <p>image</p>   
            </div>
        </div>
        <h3>Driver</h3>
        <div className='commuter'>
        <div>
              <p>image</p>  
            </div>
            <div className = 'commuterdetails'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
       
            </div>     
            
        </div>
    </div>
  )
}

export default Services