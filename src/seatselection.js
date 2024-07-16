import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './seatselection.css';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [commuter, setCommuter] = useState('');
  const [paymentForm, setPaymentForm] = useState(false);
  const [booking, setBooking] = useState({
    BusBooked: '',
    seat: '',
    date: '',
    cost: 0,
    routeNumber: '',
    email:''
  });

  useEffect(() => {
    if (!location.state) {
      navigate('/error');
    } else {
      const { selectedRoute, vehicleType, date } = location.state;
      setBooking((prevBooking) => ({
        ...prevBooking,
        BusBooked: `${vehicleType} seater`,
        seat: `${selectedSeat}`,
        date: `${date}`,
        routeNumber: `${selectedRoute.routeid}`,
      }));
      // Fetch cost separately
    }
  }, [location, navigate, selectedSeat]);

  useEffect(() => {
    if (location.state?.selectedRoute) {
      fetchCost(location.state.selectedRoute.routeid);
    }
  }, [location.state?.selectedRoute]);

  const fetchCost = async (routeId) => {
    try {
      const response = await axios.post(`http://localhost:5000/cost`, { routeid: routeId });  
      setBooking((prevBooking) => ({
        ...prevBooking,
        cost: response.data.cost,  
      }));
    } catch (error) {
      console.error('Error fetching cost:', error);
    }
  };

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
    setBooking((prevBooking) => ({
      ...prevBooking,
      seat: seat

    }));
  };

  const handleBooking = async () => {
    const { selectedRoute, vehicleType, date } = location.state;
    const bookingDetails = {
      commuter,
      vehicle: vehicleType,
      bookingDate: date,
      bookingStatus: 'confirmed',
      routeNumber: selectedRoute.routeid,
      seat: selectedSeat, // Ensure the selected seat is included
    };

    console.log('Booking Details:', bookingDetails);

    try {
      const response = await axios.post('http://localhost:5000/api/data/bookings', bookingDetails);
      alert('Booking confirmed!');
      setPaymentForm(true);
    } catch (error) {
      console.error('Error confirming booking:', error.response ? error.response.data : error.message);
      alert('Failed to confirm booking');
    }
  };

  const makePayment = async (token) => {
    console.log('Booking Cost:', booking.cost); // Log the booking cost before making payment
  
    if (booking.cost <= 0) {
      alert('Invalid booking cost');
      return;
    }
  
    const body = {
      token,
      booking,
    };
  
    const headers = {
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
  
      const { status } = response;
      console.log('STATUS ', status);
      alert('Payment successful');
  
      const updatePaymentsTable = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/updatepayments', {
            date: booking.date,
            cost: booking.cost,
            routeNumber: booking.routeNumber,
            commuter,
          });
          console.log('Payment details updated:', response.data);
        } catch (error) {
          console.error('Error updating payment details:', error.response ? error.response.data : error.message);
        }
      };
  
      await updatePaymentsTable();
      setTimeout(() => {
        navigate('/seatpick');
      }, 1000);
    } catch (error) {
      console.log(error);
      alert('Payment failed');
    }
  };
  const renderSeats = () => {
    let rows;
    const { vehicleType } = location.state;
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

  if (!location.state) {
    return (
      <div>
        <h3>Error</h3>
        <p>You cannot access this page directly. Please select a route first.</p>
      </div>
    );
  }

  const { selectedRoute, vehicleType, date } = location.state;

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
      {paymentForm && (
        <div>
          <StripeCheckout
            stripeKey={process.env.REACT_APP_KEY}
            token={makePayment}
            name="Fare payment"
            amount={booking.cost * 100}
          >
            <button>Click to pay</button>
          </StripeCheckout>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
