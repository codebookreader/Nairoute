import React from 'react'
import { useState,useEffect } from 'react'
import Commutertable from '../Tables/Commutertable'
import Drivertable from '../Tables/DriverTable'
import { getCommuters } from '../apirequests/Api'
import { getDrivers } from '../apirequests/Api'

const Statistics = () => {
    const [commuters,setCommuters] = useState([])
    const [drivers,setDrivers] = useState([])
   useEffect(()=>{
        getCommuters()
        .then(res=>{
           
            setCommuters(res.data)
        })
        .catch(err=>console.log(err))
        getDrivers()
        .then(res=>{
          console.log(res.data)
          setDrivers(res.data)
       })
        .catch(err=>console.log(err))
},[])
  return (
    <div>
        <br></br>
        <h3 style={{color:'blue'}}>View app statistics for better decision making</h3>
        <br></br>
        <Commutertable commuters = {commuters}/>
        <Drivertable drivers = {drivers}/>
       
    </div>
  )
}

export default Statistics