import React, { useState, useEffect } from 'react';

const EditCommuter = () => {
    const [commuter, setCommuter] = useState({});
    const email = sessionStorage.getItem('email');

    useEffect(() => {
        // Fetch the commuter details based on the email from the server
        fetch(`/api/commuters/${email}`)
            .then(response => response.json())
            .then(data => setCommuter(data))
            .catch(error => console.error(error));
    }, [email]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCommuter(prevCommuter => ({
            ...prevCommuter,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send the updated commuter details to the server for saving
        fetch(`/api/commuters/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commuter)
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                console.log(data);
                // Redirect or show a success message
            })
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h2>Edit Commuter</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={commuter.name || ''} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Age:
                    <input type="number" name="age" value={commuter.age || ''} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Address:
                    <input type="text" name="address" value={commuter.address || ''} onChange={handleInputChange} />
                </label>
                <br />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditCommuter;