
import Navbar from './Navbar';

import React, {useState, useRef, useEffect} from 'react';
import {LoadScript, StandaloneSearchBox} from '@react-google-maps/api';

const libraries = ['places'];

const GooglePlacesAutocomplete = () => {
	const [address, setAddress] = useState('');
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
      <div>
        <Navbar />
      </div>
		<LoadScript googleMapsApiKey='AIzaSyCfGf7UHR5wJZXXqmwgb6Aggk7tBFw15-8' libraries={libraries}>
			<div className='container mt-5'>
				<div className='row justify-content-center'>
					<div className='col-md-8'>
						<StandaloneSearchBox onLoad={reference => (searchBoxReference.current = reference)} onPlacesChanged={handlePlacesChanged}>
							<input
								type='text'
								placeholder='Search places...'
								className='form-control'
								style={{fontSize: '14px'}}
							/>
						</StandaloneSearchBox>
						<div className='mt-3 p-3 border rounded bg-light'>
							<h5>Selected Address</h5>
							<p className='mb-0'>{address}</p>
						</div>
					</div>
				</div>
			</div>
		</LoadScript>
		</>
	);
};

export default GooglePlacesAutocomplete;
