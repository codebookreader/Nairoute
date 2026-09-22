import React, { useState, useEffect } from 'react';
import Commutertable from '../Tables/Commutertable';
import Drivertable from '../Tables/DriverTable';
import { getCommuters, getDrivers } from '../apirequests/Api';
import DriverEarnings from '../Tables/DriverEarnings';

const Statistics = () => {
  const [commuters, setCommuters] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commutersResponse = await getCommuters();
        setCommuters(commutersResponse.data);
        const driversResponse = await getDrivers();
        setDrivers(driversResponse.data);
      } catch (err) {
        console.log(err);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <br />
      <h3 style={{ color: 'blue' }}>View app statistics for better decision making</h3>
      <br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Commutertable commuters={commuters} />
      <Drivertable drivers={drivers} />
      <hr style={{ height: '5px', borderWidth: '2px' }} />
      <br />
      <h3 style={{ color: 'blue' }}>Funds management</h3>
      <br />
      <h4>View and manage funds. <span >Select the month and year</span></h4>

      <DriverEarnings />
    </div>
  );
};

export default Statistics;
