import React,{useState} from 'react'
import Navbar from './Navbar'

const Driverdashboard = () => {
    // Dummy data for bookings
    const [bookings, setBookings] = useState([
        { id: 1, vehicle: 'Toyota Probox', customer: 'John Doe', date: '2021-09-01', bookingStatus: 'pending' },
        { id: 2, vehicle: 'Toyota Wish', customer: 'Jane Doe', date: '2021-09-02', bookingStatus: 'pending' },
        { id: 3, vehicle: 'Toyota Probox', customer: 'James Doe', date: '2021-09-03', bookingStatus: 'pending' },
    ]);

    const confirmBooking = (id) => {
        const updatedBookings = bookings.map((booking) => {
            if (booking.id === id) {
                return { ...booking, bookingStatus: 'confirmed' };
            }
            return booking;
        });
        setBookings(updatedBookings);
    };

    return (
        <div>
            <Navbar/>
            <h1>Welcome to the driver dashboard</h1>
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