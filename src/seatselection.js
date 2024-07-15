import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './seatselection.css';
import axios from 'axios'; // Import axios for making API calls

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [commuter, setCommuter] = useState(''); // Add a state for commuter name

  useEffect(() => {
    if (!location.state) {
      navigate('/error');
    }
  }, [location, navigate]);

  if (!location.state) {
    return (
      <div>
        <h3>Error</h3>
        <p>You cannot access this page directly. Please select a route first.</p>
      </div>
    );
  }

  const { selectedRoute, vehicleType, date } = location.state;

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
  };

  const handleBooking = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, {
        commuter,
        vehicle: vehicleType,
        bookingDate: date,
        bookingStatus: 'confirmed', // Example status
        routeNumber: selectedRoute.routeid,
      });
      alert('Booking confirmed!');
      navigate('/confirmation'); // Navigate to a confirmation page if needed
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking');
    }
  };

  const renderSeats = () => {
    let rows;
    if (vehicleType === '14') {
      rows = [
        ['D', 1, 2],
        [3, 4, 5],
        [6, null, 7, 8],
        [9, null, 10, 11],
        [12, 13, 14],
      ];
    } else {
      rows = [
        [1, 2, null, 3, 4],
        [5, 6, null, 7, 8],
        [9, 10, null, 11, 12],
        [13, 14, null, 15, 16],
        [17, 18, null, 19, 20],
        [21, 22, null, 23, 24],
        [25, 26, null, 27, 28],
        [29, 30, 31, 32],
      ];
    }

    return (
      <div className="bus">
        <div className="seat-grid">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {row.map((seat, seatIndex) => (
                <button
                  key={seatIndex}
                  onClick={() => seat && handleSeatSelect(seat)}
                  className={`seat ${selectedSeat === seat ? 'selected' : ''}`}
                  disabled={!seat}
                >
                  {seat === 'D' ? 'Driver' : seat || ''}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="seat-selection">
      <h3>Select a Seat for Route: {selectedRoute.routeid}</h3>
      {renderSeats()}
      {selectedSeat && (
        <div className="booking-summary">
          <h3>Booking Summary:</h3>
          <p>Route ID: {selectedRoute.routeid}</p>
          <p>Source: {selectedRoute.source}</p>
          <p>Destination: {selectedRoute.destination}</p>
          <p>Stops: {selectedRoute.stops}</p>
          <p>Date: {date}</p>
          <p>Vehicle: {vehicleType} Seater</p>
          <p>Seat: {selectedSeat}</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={commuter}
            onChange={(e) => setCommuter(e.target.value)}
            />

          <button onClick={handleBooking}>Confirm Booking</button>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
