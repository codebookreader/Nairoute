import React, { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';

const GooglePlacesAutocomplete = ({ label, setAddress }) => {
  const searchBoxReference = useRef(null);

  const handlePlacesChanged = () => {
    const places = searchBoxReference.current.getPlaces();
    const place = places[0];
    if (place) {
      setAddress(place.formatted_address);
    }
  };

  return (
    <>
        <div className='container mt-5'>
          <div className='row justify-content-center'>
            <div className='col-md-8'>
              <div className='form-group'>
                <label>{label}</label>
                <StandaloneSearchBox onLoad={ref => (searchBoxReference.current = ref)} onPlacesChanged={handlePlacesChanged}>
                  <input
                    type='text'
                    placeholder='Search places...'
                    className='form-control'
                    style={{ fontSize: '14px' }}
                  />
                </StandaloneSearchBox>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default GooglePlacesAutocomplete;
