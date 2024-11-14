import axios from 'axios';

const customFetch = axios.create({
  baseURL: '/api/v1/test',
});

export default customFetch;
