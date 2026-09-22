import React, { useState } from 'react'
import './table.css';


const Commutertable = ({commuters}) => {
    const [filteredCommuter, setFilteredCommuter] = useState([]);
    const [filteredCommuterTable, setFilteredCommuterTable] = useState(false);
    const handleViewCommuters = (Status) => {
        const filteredCommuters = commuters.filter(commuter => commuter.Status === Status);
        setFilteredCommuter(filteredCommuters);
        setFilteredCommuterTable(true);
    }
return (
    <div>
        
        <div style={{display:'flex',justifyContent:"space-between",alignItems:"centre"}}>
        <div>
        <h2>Commuters</h2>
        <table>
            <thead>
                <tr>  
                    <th>Status</th>
                    <th>Count</th>   
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                {commuters && ['Active', 'Inactive', 'Dormant', 'Banned'].map(Status => (
                    <tr key={Status}>
                        <td>{Status}</td>
                        <td>{commuters.filter(commuter => commuter.Status === Status).length}</td>
                        <td><button onClick={() => handleViewCommuters(Status)}>View</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        {filteredCommuterTable && (
            <div>
                <h2>Filtered Commuters</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCommuter.map(commuter => (
                            <tr key={commuter.email}>
                                <td>{commuter.email}</td>
                                <td>{commuter.firstName}</td>
                                <td>{commuter.Status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button style={{marginLeft:'80%'}} onClick={() => setFilteredCommuterTable(false)}>Back</button>
            </div>
        )}
        </div>
    </div>
);
}

export default Commutertable
