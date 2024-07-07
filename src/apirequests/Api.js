import axios from 'axios';

const URL = 'http://localhost:5000/api';

export const getCommuters = () => axios.get(`${URL}/users`);
export const getDrivers = () => axios.get(`${URL}/drivers`);