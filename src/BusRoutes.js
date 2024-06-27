import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const BusRoutes = ({ origin, destination, startTime, endTime }) => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (origin && destination && !requestSent) {
      const transitOptions = {
        modes: ['BUS'],
        departureTime: startTime ? new Date(startTime) : undefined,
        arrivalTime: endTime ? new Date(endTime) : undefined,
      };

      const requestOptions = {
        destination,
        origin,
        travelMode: 'TRANSIT',
        transitOptions,
      };

      console.log("Request Options: ", requestOptions);

      setRequestSent(true); // Ensure the request is only sent once
    }
  }, [origin, destination, startTime, endTime, requestSent]);

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
      } else {
        setError(response);
      }
    }
  };

  return (
    <div>
      <GoogleMap
        id="bus-routes-map"
        mapContainerStyle={{ height: '400px', width: '100%' }}
        zoom={8}
        center={{ lat: 1.2921, lng: 36.8219 }}  // Coordinates for Nairobi, Kenya
      >
        {!requestSent ? (
          <DirectionsService
            options={{
              destination,
              origin,
              travelMode: 'TRANSIT',
              transitOptions: {
                modes: ['BUS'],
                departureTime: startTime ? new Date(startTime) : undefined,
                arrivalTime: endTime ? new Date(endTime) : undefined,
              },
            }}
            callback={directionsCallback}
          />
        ) : null}
        {directions && <DirectionsRenderer options={{ directions }} />}
      </GoogleMap>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default BusRoutes;
