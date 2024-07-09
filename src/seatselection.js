import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './seatselection.css'; // Import the custom CSS

const SeatSelection = () => {
    const location = useLocation();
    const { selectedRoute, vehicleType, date } = location.state;
    const [selectedSeat, setSelectedSeat] = useState(null);

    const handleSeatSelect = (seat) => {
        setSelectedSeat(seat);
    };

    const renderSeats = () => {
        const seats = [
            1, 2,  3, 4, null,
            5, 6, 7, 8, null,
            9, 10, 11, 12, null,
            13, 14, 15, 16, null,
            17, 18, 19, 20, null,
            21, 22, 23, 24, null,
            25, 26, 27, 28, null,
            29, 30, 31, 32, null,
            33, 34, 35, null,
        ];

        return (
            <div className="seat-grid">
                {seats.map((seat, index) => (
                    <button
                        key={index}
                        onClick={() => seat && handleSeatSelect(seat)}
                        className={`seat ${selectedSeat === seat ? 'selected' : ''}`}
                        disabled={!seat}
                    >
                        {seat || ''}
                    </button>
                ))}
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
                    <button>Confirm Booking</button>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;
