import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://levelup-production-96c2.up.railway.app'
    : 'http://localhost:5000',  
  withCredentials: true         
});

export default api;
