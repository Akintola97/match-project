import React, { useState, useEffect } from "react";
import axios from "axios";

const Location = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState("");

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

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const userLocation = await getUserLocation();
        console.log(userLocation);
        const response = await axios.post("/user/facilities", { userLocation });
        // setFacilities(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error getting user location or fetching facilities:",
          error
        );
        window.alert(error.message);
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return <div className=" p-32"></div>;
};

export default Location;
