// src/ErrorPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div>
            <h1>Error</h1>
            <p>Sorry, an error has occurred. Please try again later.</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
};

export default ErrorPage;   
