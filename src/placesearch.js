import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const PlaceSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [error, setError] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log(place);
      setSearchQuery(place.name);
    } else {
      setError('Oops! Something went wrong with autocomplete.');
    }
  };

  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCkieJSxlO94asHjJsorQFgvNKNmchgJpA" libraries={['places']}>
      <div>
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={handlePlaceSelect}
        >
          <input
            type="text"
            placeholder="Search places..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Autocomplete>
        {error && <p>{error}</p>}
      </div>
    </LoadScript>
  );
};

export default PlaceSearch;