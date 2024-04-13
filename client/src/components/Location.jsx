import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from "react-icons/ai";

const Location = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showZipCodeInput, setShowZipCodeInput] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [searchZipCode, setSearchZipCode] = useState(''); // State for the search input

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleZipCodeSubmit = async () => {
    try {
      const response = await axios.post('/user/facilities', { zipCode });
      setFacilities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching facilities based on zip code:', error);
      alert(error.message);
      setLoading(false);
    }
  };

  const handleSearchSubmit = async () => { // Function to handle search by zip code
    try {
     // const response = await axios.post('/user/facilities', { zipCode: searchZipCode });
      // setFacilities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching facilities based on zip code:', error);
      alert(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { latitude, longitude } = await getUserLocation();
        // const response = await axios.post('/user/facilities', { latitude, longitude });
        // setFacilities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error getting user location or fetching facilities:', error);
        setShowZipCodeInput(true);
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className='w-full min-h-screen bg-gray-900 pt-[12vh]'>
      {showZipCodeInput || facilities.length === 0 ? (
        <div className='flex flex-col justify-center items-center'>
          <label htmlFor="zipCode" className="mb-2">Enter Your Zip Code:</label>
          <input
            type="text"
            id="zipCode"
            className="input input-bordered input-primary mb-4"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleZipCodeSubmit}>Submit</button>
        </div>
      ) : (
        <>
        <div className='w-full h-full flex justify-end'>
        <form className='p-1 pb-8' onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="bg-transparent focus:outline-none border-b text-white cursor-pointer"
          placeholder="Enter new zip code"
          value={searchZipCode}
          onChange={(e) => setSearchZipCode(e.target.value)}
        />
        <button className="text-white bg-green-500 rounded-md p-1.5">
            <AiOutlineSearch className="text-[2.0vmin]" />
          </button>
          </form>
      </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility, index) => (
            <div key={index} className=" text-white">
              <div>
                {facility.photos && facility.photos.length > 0 ? (
                  facility.photos.map((photoUrl, photoIndex) => (
                    <img key={photoIndex} src={photoUrl} alt={`Facility Image ${photoIndex + 1}`} className="w-full" />
                  ))
                ) : (
                  <p>No photos available</p>
                )}
              </div>
              <h1 className='text-center'>{facility.name}</h1>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default Location;
