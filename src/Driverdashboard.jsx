import React,{useState} from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Driverdashboard = () => {
    axios.defaults.withCredentials = true;
    // Dummy data for bookings
    const [bookings, setBookings] = useState([
        { id: 1, vehicle: '34Seater', customer: 'John Doe', date: '2021-09-01', bookingStatus: 'pending' },
        { id: 2, vehicle: '14Seater', customer: 'Jane Doe', date: '2021-09-02', bookingStatus: 'pending' },
        { id: 3, vehicle: '34Seater', customer: 'James Doe', date: '2021-09-03', bookingStatus: 'pending' },
    ]);

    const [profile, setProfile] = useState(null);
    const[showProfile,setShowProfile] = useState(false)
    const [email, setEmail] = useState('');
    const userType = 'driver';
    const navigate = useNavigate();
    const confirmBooking = (id) => {
        const updatedBookings = bookings.map((booking) => {
            if (booking.id === id) {
                return { ...booking, bookingStatus: 'confirmed' };
            }
            return booking;
        });
        setBookings(updatedBookings);
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
        axios.get('http://localhost:5000/driverdashboard')
          .then(res => {
            if (res.data.valid) {
              setEmail(res.data.email);
            } else {
              navigate('/driverlogin');
            }
          })
          .catch(err => console.log(err));
        }, []);
    
    const handleLogout = () => {
        axios.post('http://localhost:5000/logout')
          .then(res => {
            console.log('Server response:', res.data); 
            if (res.data.success) {
              navigate('/driverlogin');
            } else {
              console.log('Logout failed:', res.data.message);
            }
          })
          .catch(err => console.log('Logout error:', err));
      };

    return (
        <div>
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
            <h1>Welcome to the driver dashboard</h1>
            {showProfile && (
        <div className='card'>
          <h2>Profile Details</h2>
          <p>First Name: {profile.firstName}</p>
          <p>Surname: {profile.secondname}</p>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phoneNumber}</p>
          <button onClick={() => setShowProfile(false)}>Close</button>
        </div>
      )}
            <h2>View Trips</h2>
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Vehicle</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.vehicle}</td>
                            <td>{booking.customer}</td>
                            <td>{booking.date}</td>
                            <td>{booking.bookingStatus}</td>
                            <td>
                                {booking.bookingStatus === 'pending' && (
                                    <button onClick={() => confirmBooking(booking.id)}>Confirm</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>View Earnings</h2>
            <h2>View Ratings and feedback</h2>
        </div>
    );
};

export default Driverdashboard