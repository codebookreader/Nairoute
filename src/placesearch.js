import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.js';
import BusRoutes from './BusRoutes.js';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete.js';

const libraries = ['places'];

const loadScript = (url) => {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
};

const PlaceSearch = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const googleMapsApiKey = '';
    const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`;

    window.initMap = () => {
      // Initialization code or callback function after Google Maps API is loaded
    };

    loadScript(googleMapsUrl);

    return () => {
      // Cleanup script if needed
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <GooglePlacesAutocomplete label="Origin" setAddress={setOrigin} />
          </div>
          <div className="mb-3">
            <GooglePlacesAutocomplete label="Destination" setAddress={setDestination} />
          </div>
          <div className="mb-3">
            <label className="form-label">Start Time:</label>
            <input
              type="datetime-local"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">End Time:</label>
            <input
              type="datetime-local"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary mt-3">Get Routes</button>
          </div>
        </form>
        {submitted && <BusRoutes origin={origin} destination={destination} startTime={startTime} endTime={endTime} />}
      </div>
    </>
  );
};

export default PlaceSearch;
