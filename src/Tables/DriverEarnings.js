import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DriverEarnings = ({ earnings }) => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [filteredEarnings, setFilteredEarnings] = useState([]);

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    useEffect(() => {
        axios.get('http://localhost:5000/api/driverEarnings')
            .then(res => {
                const filteredEarnings = res.data.filter(earning => {
                    const paymentDate = new Date(earning.payment_date);
                    return (
                        (month ? paymentDate.getMonth() + 1 === parseInt(month) : true) &&
                        (year ? paymentDate.getFullYear() === parseInt(year) : true)
                    );
                });
                setFilteredEarnings(filteredEarnings);
            })
            .catch(error => {
                console.error('Error fetching earnings:', error);
            });
    }, [month, year]);

    return (
        <div>
            <form>
                <label>
                    Month:
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={month}
                        onChange={handleMonthChange}
                    />
                </label>
                <label>
                    Year:
                    <input
                        type="number"
                        min="1900"
                        max="2100"
                        value={year}
                        onChange={handleYearChange}
                    />
                </label>
            </form>
            {filteredEarnings.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Driver</th>
                            <th>Booking ID</th>
                            <th>Payment Date</th>
                            <th>Amount Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEarnings.map((earning, index) => (
                            <tr key={index}>
                                <td>{earning.driver}</td>
                                <td>{earning.booking_id}</td>
                                <td>{earning.payment_date}</td>
                                <td>{earning.amount_paid}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DriverEarnings;
