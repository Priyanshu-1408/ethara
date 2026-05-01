import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

axios.defaults.baseURL = "https://ethara-production-6235.up.railway.app";

// Add a request interceptor to log outgoing requests
axios.interceptors.request.use(request => {
  console.log('API Request:', request.method.toUpperCase(), request.url, request.data || '');
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add a response interceptor to log incoming responses
axios.interceptors.response.use(response => {
  console.log('API Response:', response.status, response.config.url, response.data);
  return response;
}, error => {
  console.error('API Response Error:', error.response?.status, error.config?.url, error.response?.data || error.message);
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
