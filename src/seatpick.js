import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (origin && destination) {
            fetchRoutes();
        }
    }, [origin, destination]);

    const fetchRoutes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/routes`, {
                params: { origin, destination }
            });
            if (response.data.success) {
                setRoutes(response.data.data);
            } else {
                setRoutes([]);
                setError('No routes found.');
            }
        } catch (error) {
            console.error('Error fetching routes:', error.response || error);
            setError('Failed to fetch routes. Please try again.');
            setRoutes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
    };

    const handleVehicleSelect = (type) => {
        navigate('/seat-selection', { state: { selectedRoute, vehicleType: type, date } });
    };

    return (
        <div className="booking-form">
            <div className="search-inputs">
                <input
                    type="text"
                    placeholder="Origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {isLoading && <p>Loading routes...</p>}
            {error && <p className="error">{error}</p>}

            {routes.length > 0 && (
                <div className="route-list">
                    <h3>Available Routes:</h3>
                    {routes.map((route) => (
                        <button key={route.routeid} onClick={() => handleRouteSelect(route)}>
                            {route.source} to {route.destination}
                        </button>
                    ))}
                </div>
            )}

            {selectedRoute && (
                <div className="route-details">
                    <h3>Selected Route Details:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Route ID</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Stops</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{selectedRoute.routeid}</td>
                                <td>{selectedRoute.source}</td>
                                <td>{selectedRoute.destination}</td>
                                <td>{selectedRoute.stops}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {selectedRoute && (
                <div className="vehicle-selection">
                    <h3>Select Vehicle Type:</h3>
                    
                    <button onClick={() => handleVehicleSelect('14')}>14 Seater</button >
                    <button onClick={() => handleVehicleSelect('33')}>33 Seater</button>
                </div>
            )}
        </div>
    );
};

export default BookingForm;
