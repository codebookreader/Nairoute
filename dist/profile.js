import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch bookings and payments data from your backend
    axios.get('/api/bookings')
      .then(response => setBookings(response.data))
      .catch(error => console.error('Error fetching bookings:', error));

    axios.get('/api/payments')
      .then(response => setPayments(response.data))
      .catch(error => console.error('Error fetching payments:', error));
  }, []);

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens, etc.)
    alert('Logged out');
    history.push('/login');
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-section">
        <h2>Bookings</h2>
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <p>Booking ID: {booking.id}</p>
              <p>Date: {booking.date}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="profile-section">
        <h2>Payments</h2>
        <div className="payments-list">
          {payments.map(payment => (
            <div key={payment.id} className="payment-item">
              <p>Payment ID: {payment.id}</p>
              <p>Amount: {payment.amount}</p>
            </div>
          ))}
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
