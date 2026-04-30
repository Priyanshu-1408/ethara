import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ethara-production-6235.up.railway.app/api'
});

export default api;
