import axios from 'axios';

// Create a configured instance of axios
const api = axios.create({
  baseURL: 'https://api.firecasetracking.local/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
