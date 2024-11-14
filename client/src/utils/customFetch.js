import axios from 'axios';

const customFetch = axios.create({
  baseURL: 'http://localhost:5174/api/v1',
});

export default customFetch;
 