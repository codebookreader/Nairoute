import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const DriverEarnings = ({ earnings }) => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [filteredEarnings, setFilteredEarnings] = useState([]);
    const chartRef = useRef(null);

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
        if (filteredEarnings.length > 0) {
            const earningsByMonth = {};
            filteredEarnings.forEach(earning => {
                const paymentDate = new Date(earning.payment_date);
                const monthKey = `${paymentDate.getFullYear()}-${paymentDate.getMonth() + 1}`;
                if (!earningsByMonth[monthKey]) {
                    earningsByMonth[monthKey] = 0;
                }
                earningsByMonth[monthKey] += earning.amount_paid;
            });

            const labels = Object.keys(earningsByMonth).sort();
            const data = labels.map(label => earningsByMonth[label]);

            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const ctx = document.getElementById('myChart').getContext('2d');
            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Earnings',
                        data: data,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'month',
                            }
                        },
                        y: {
                            beginAtZero: true,
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
                <div style={{display:'flex'}}>
                <label>
                    Month:
                    <select style={{marginRight:'20px'}} value={month} onChange={handleMonthChange}>
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
                    <br></br>
                    <h3 style={{ color: 'blue' }}>Earning trends</h3>
                    <br></br>
                    <div>
                        <canvas id="myChart" width="400" height="200"></canvas>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverEarnings;
