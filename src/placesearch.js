import React, {useState} from 'react';
import {LoadScript} from '@react-google-maps/api';
import Navbar from './Navbar.js';
import BusRoutes from './BusRoutes.js';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete.js';

const libraries = ['places'];

const PlaceSearch = () => {
	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = e => {
		e.preventDefault();
		setSubmitted(true);
	};

	return (
		<>
			<Navbar />
			<LoadScript googleMapsApiKey='AIzaSyCfGf7UHR5wJZXXqmwgb6Aggk7tBFw15-8' libraries={libraries}>
				<div className='container mt-5'>
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<GooglePlacesAutocomplete label='Origin' setAddress={setOrigin} />
						</div>
						<div className='mb-3'>
							<GooglePlacesAutocomplete label='Destination' setAddress={setDestination} />
						</div>
						<div className='mb-3'>
							<label className='form-label'>Start Time:</label>
							<input
								type='datetime-local'
								className='form-control'
								value={startTime}
								onChange={e => setStartTime(e.target.value)}
							/>
						</div>
						<div className='mb-3'>
							<label className='form-label'>End Time:</label>
							<input
								type='datetime-local'
								className='form-control'
								value={endTime}
								onChange={e => setEndTime(e.target.value)}
							/>
						</div>
						<div className='text-center'>
							<button type='submit' className='btn btn-primary mt-3'>Get Routes</button>
						</div>
					</form>
					{submitted && <BusRoutes origin={origin} destination={destination} startTime={startTime} endTime={endTime} />}
				</div>
			</LoadScript>
		</>
	);
};

export default PlaceSearch;
