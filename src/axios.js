import axios from 'axios';

export default axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000', // Adjust the baseURL according to your backend setup
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});