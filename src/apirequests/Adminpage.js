import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import Commutertable from '../Tables/Commutertable'
import Drivertable from '../Tables/DriverTable'

const Adminpage = () => {
    const [commuters,setCommuters] = useState([])
    const [drivers,setDrivers] = useState([])
   useEffect(()=>{
        axios.get('http://localhost:5000/api/users')
        .then(res=>{
           
            setCommuters(res.data)
        })
        .catch(err=>console.log(err))
        axios.get('http://localhost:5000/api/drivers')
        .then(res=>{
          console.log(res.data)
          setDrivers(res.data)
       })
        .catch(err=>console.log(err))
},[])
  return (
    <div>
        <h2 >Adminpage</h2><br></br>
        <h3 style={{color:'blue'}}>View app statistics for better decision making</h3>
        <br></br>
        <Commutertable commuters = {commuters}/>
        <Drivertable drivers = {drivers}/>
       
    </div>
  )
}

export default Adminpage