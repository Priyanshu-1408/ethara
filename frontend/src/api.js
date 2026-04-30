import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ethara-production-6235.up.railway.app/api'
});

export default api;
