import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

const RootComponent = () => {
  const [data, setData] = useState(null); // State to store the fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/test', {
          withCredentials: true, // Ensure the token is sent with the request
        });
        setData(response.data); // Update the state with the fetched data
        console.log(response.data); // Log the response data
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
      }
    };
  
    fetchData();
  }, []);
  // Empty dependency array means this runs once on mount

  return (
    <>
      <App />
      <ToastContainer position='top-center' />
      {/* You can render the fetched data here if needed */}
      {data && <div>{JSON.stringify(data)}</div>}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<RootComponent />);
