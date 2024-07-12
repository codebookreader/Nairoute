import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Adminpage = () => {
  axios.defaults.withCredentials = true;
  const [profile, setProfile] = useState(null);
  const[showProfile,setShowProfile] = useState(false)
  const [email, setEmail] = useState('');
  const userType = 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/adminpage')
      .then(res => {
        if (res.data.valid) {
          setEmail(res.data.email);
        } else {
          navigate('/adminlogin');
        }
      })
      .catch(err => console.log(err));

    axios.post('http://localhost:5000/api/updateStatus')
      .then(res => {
        console.log(res.data.message);
      })
      .catch(err => console.log(err));
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.post('http://localhost:5000/profile', { userType, email });
      setProfile(response.data.profile);
      setShowProfile(true)
    } catch (error) {
      console.error('Error fetching profile:', error.response || error);
    }
  };

  const handleLogout = () => {
    axios.post('http://localhost:5000/logout')
      .then(res => {
        console.log('Server response:', res.data);
        if (res.data.success) {
          navigate('/adminlogin');
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
      <h1>Admin Page</h1>
      {showProfile && (
        <div className='card'>
          <h2>Profile Details</h2>
          <p>First Name: {profile.firstname}</p>
          <p>Surname: {profile.secondname}</p>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phoneNumber}</p>
          <button onClick={() => setShowProfile(false)}>Close</button>
        </div>
      )}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul>
          <li><a href="/statistics">Statistics</a></li>
          <li><a href="/managecommuters">Commuters</a></li>
          <li><a href="/managedrivers">Drivers</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Adminpage;
