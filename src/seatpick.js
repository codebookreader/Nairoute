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
    const [profile, setProfile] = useState(null);
    const[showProfile,setShowProfile] = useState(false)
    const [email, setEmail] = useState('');
    const userType = 'commuter ';
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
            const response = await axios.get(`http://localhost:5000/showall `, {
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
    const fetchProfile = async () => {
        try {
          const response = await axios.post('http://localhost:5000/profile', { userType, email });
          setProfile(response.data.profile);
          setShowProfile(true)
        } catch (error) {
          console.error('Error fetching profile:', error.response || error);
        }
      };
      useEffect(() => {
        axios.get('http://localhost:5000/dashboard')
          .then(res => {
            if (res.data.valid) {
              setEmail(res.data.email);
            } else {
              navigate('/login');
            }
          })
          .catch(err => console.log(err));
        }, []);
    
    const handleLogout = () => {
        axios.post('http://localhost:5000/logout')
          .then(res => {
            console.log('Server response:', res.data); 
            if (res.data.success) {
              navigate('/login');
            } else {
              console.log('Logout failed:', res.data.message);
            }
          })
          .catch(err => console.log('Logout error:', err));
      };

    const handleEditProfile = () => {
      navigate('/edit-profile');
    };

    return (
      <div className="booking-form">
        <nav className="navbar navbar-expand-lg navbar-light">
          <a className="navbar-brand" href="/">Nairoute</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/services">Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">Contact</a>
              </li>
            </ul>
            <div className="dropdown">
              <button className="btn bg-warning rounded-pill" type="button">
                Profile
              </button>
              <div className="dropdown-content">
                <button style={{ margin: 'auto' }} onClick={fetchProfile}>View</button>
                <div className="dropdown-divider" style={{ height: '1px', backgroundColor: '#e5e5e5' }}></div>
                <button className="btn btn-danger" style={{ margin: 'auto' }} onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </nav>
        <h1>Welcome to the commuter page</h1>
        {showProfile && (
          <div className='card'>
            <h2>Profile Details</h2>
            <p>First Name: {profile.firstName}</p>
            <p>Surname: {profile.secondname}</p>
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phoneNumber}</p>
            <div style={{display:'flex',justifyContent:'space-between'}}>
            <button style={{ margin: 'auto' }} onClick={handleEditProfile}>Edit</button>
            <button onClick={() => setShowProfile(false)}>Close</button>
            </div>
          </div>
        )}
        <h3>Start your journey</h3>

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
