import React from 'react'
import { useState } from 'react';

const DriverTable = ({ drivers }) => {
    const [filteredDriver, setFilteredDriver] = useState([]);
    const [filteredDriverTable, setFilteredDriverTable] = useState(false);
  
    const handleViewDrivers = (Status) => {
      const filteredDrivers = drivers.filter((driver) => driver.Status === Status);
      setFilteredDriver(filteredDrivers);
      setFilteredDriverTable(true);
    };
return (
    <div>
        
        <div style={{display:'flex',justifyContent:"space-between",alignItems:"centre"}}>
        <div>
        <h2>Drivers</h2>
        <table>
            <thead>
                <tr>  
                    <th>Status</th>
                    <th>Count</th>   
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                {drivers && ['Active', 'Inactive', 'Dormant', 'Banned'].map(Status => (
                    <tr key={Status}>
                        <td>{Status}</td>
                        <td>{drivers.filter(driver => driver.Status === Status).length}</td>
                        <td><button onClick={() => handleViewDrivers(Status)}>View</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        {filteredDriverTable && (
            <div>
                <h2>Filtered Drivers</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDriver.map(Driver => (
                            <tr key={Driver.email}>
                                <td>{Driver.email}</td>
                                <td>{Driver.firstName}</td>
                                <td>{Driver.Status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button style={{marginLeft:'80%'}} onClick={() => setFilteredDriverTable(false)}>Back</button>
            </div>
        )}
        </div>
    </div>
  )
}

export default DriverTable