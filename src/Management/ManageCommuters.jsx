import React from 'react'
import { useState,useEffect } from 'react'
import { getCommuters } from '../apirequests/Api'
import axios from 'axios'

const ManageCommuters = () => {
    const [commuters,setCommuters] = useState([])
    const[message,setMessage] = useState('')
    useEffect(()=>{
        getCommuters()
        .then(res=>{
            console.log(res.data)
            setCommuters(res.data)
        })
        .catch(err=>console.log(err))
    },[])
    const handleApprove = (email) => {
        axios.post('http://localhost:5000/api/commuter', {
            email: email
        })
        .then(res => {
            setMessage(res.message)
        })
        .catch(err => {
            console.log(err)
        })
    }
    const handleBan = (email) => {
        axios.post('http://localhost:5000/api/commuterban', {
            email: email
        })
        .then(res => {
            console.log(res.message)
        })
        .catch(err => {       
            console.log(err)
        })
    }
  return (
    <div>
        <h2>ManageCommuters</h2>
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
                {commuters.map((commuter,index)=>(
                    <tr key={index}>
                        <td>{commuter.email}</td>
                        <td>{commuter.firstName}</td>
                        <td>{commuter.SecondName}</td>
                        <td>{commuter.phoneNumber}</td>
                        <td>{commuter.ApplicationStatus}</td>
                        <td><button onClick={() => handleApprove(commuter.email)}>Approve</button></td>
                        <td><button style={{background:'maroon'}} onClick={() => handleBan(commuter.email)}>Ban</button> </td>    
                    </tr>
                ))}
            </tbody>
            </table>
            <p>{message}</p>
    </div>

  )
}

export default ManageCommuters