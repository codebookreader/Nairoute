import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js';

const DriverEarnings = ({ earnings }) => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [filteredEarnings, setFilteredEarnings] = useState([]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

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

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: filteredEarnings.map(earning => new Date(earning.payment_date).toLocaleDateString()),
                    datasets: [{
                        label: 'Earnings',
                        data: filteredEarnings.map(earning => earning.amount_paid),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [filteredEarnings]);

    const addEarnings = filteredEarnings.reduce((total, earning) => total + earning.amount_paid, 0);
    const bestPerformer = filteredEarnings.reduce((highest, earning) => (earning.amount_paid > highest.amount_paid ? earning : highest), filteredEarnings[0]);

    return (
        <div>
            <form>
                <div style={{ display: 'flex' }}>
                    <label>
                        Month:
                        <select style={{ marginRight: '20px' }} value={month} onChange={handleMonthChange}>
                            <option value="">All</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Year:
                        <input type="number" value={year} onChange={handleYearChange} placeholder="YYYY" />
                    </label>
                </div>
            </form>
            {filteredEarnings.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Driver</th>
                                <th>Amount Paid</th>
                                <th>Payment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEarnings.map((earning, index) => (
                                <tr key={index}>
                                    <td>{earning.driver}</td>
                                    <td>{earning.amount_paid}</td>
                                    <td>{new Date(earning.payment_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p>Total earnings: <span className="text-secondary">{addEarnings}</span></p>
                    <p>Best performer: <span className="text-secondary">{bestPerformer.driver}</span></p>
                    <br />
                </div>
            )}
        </div>
    );
};

export default DriverEarnings;
