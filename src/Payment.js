import React, { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const [booking, setBooking] = useState({
    BusBooked: 'Express',
    seat: '8',
    date: '12/07/2024',
    time: '12pm',
    amount: '100',
    });
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch the booking data from the MySQL database
        fetchBookingData();
    }, []);

    const fetchBookingData = () => {
        // Make a request to your server to fetch the booking data from the database
        axios.get('http://localhost:5000/api/booking')
            .then(response => response.json())
            .then(data => {
                // Update the booking state with the fetched data
                setBooking({
                    bookingId: data.bookingId,
                    cost: data.cost
                });
            })
            .catch(error => console.log(error));
    };

    const makePayment = token => {
        const body = {
            token,
            booking
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        return fetch('http://localhost:5000/payment', {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })
            .then(response => {
                console.log('RESPONSE ', response);
                const { status } = response;
                console.log('STATUS ', status);
                alert('Payment successful');
                setTimeout(() => {
                    navigate('/seatpick');
                }, 2000);
            })
            .catch(error => console.log(error));
    };

    return (
        <div>
            <div>
                <h2>Booking Details</h2>
                <h3>Confirm the details below before paying</h3>
                <p>Bus Booked: {booking.BusBooked}</p>
                <p>Seat: {booking.seat}</p>
                <p>Date: {booking.date}</p>
                <p>Time: {booking.time}</p>
                <p>Amount:{booking.amount}</p>
            </div>
            <StripeCheckout
                stripeKey={process.env.REACT_APP_KEY}
                token={makePayment}
                name="Fare payment"
                amount={booking.cost * 100}
            >
                <button>Click to pay</button>
            </StripeCheckout>
        </div>
    );
};

export default Payment;