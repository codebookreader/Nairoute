import React from 'react'
import { useState,useEffect } from 'react'
import { getDrivers } from '../apirequests/Api'
import axios from 'axios'

const ManageDrivers = () => {
    const [drivers,setDrivers] = useState([])
    useEffect(()=>{
        getDrivers()
        .then(res=>{
            console.log(res.data)
            setDrivers(res.data)
        })
        .catch(err=>console.log(err))
    },[])
    const handleApprove = (email) => {
        axios.post('http://localhost:5000/api/driver', {
            email: email
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }
  return (
    <div>
        <h2>ManageDrivers</h2>
        <table className="table">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>FirstName</th>
                    <th>SecondName</th>
                    <th>PhoneNumber</th>
                    <th>ApplicationStatus</th>
                </tr>
            </thead>
            <tbody>
                {drivers.map((driver,index)=>(
                    <tr key={index}>
                        <td>{driver.email}</td>
                        <td>{driver.firstName}</td>
                        <td>{driver.secondname}</td>
                        <td>{driver.phoneNumber}</td>
                        <td>{driver.ApplicationStatus}</td>
                        <td><button onClick={() => handleApprove(driver.email)}>Approve</button></td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
  )
}

export default ManageDrivers