// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Location = () => {
//   const [facilities, setFacilities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [distance, setDistance] = useState("");

//   const getUserLocation = () => {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           resolve({ latitude, longitude });
//         },
//         (error) => {
//           reject(error);
//         }
//       );
//     });
//   };

//   useEffect(() => {
//     const fetchFacilities = async () => {
//       try {
//         const userLocation = await getUserLocation();
//         console.log(userLocation);
//         // const response = await axios.post("/user/facilities", { userLocation });
//         // setFacilities(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error(
//           "Error getting user location or fetching facilities:",
//           error
//         );
//         window.alert(error.message);
//         setLoading(false);
//       }
//     };

//     fetchFacilities();
//   }, []);

//   return <div className=" p-32"></div>;
// };

// export default Location;


// // import React, { useState, useEffect } from "react";
// // import axios from "axios";

// // const Location = () => {
// //   const [facilities, setFacilities] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [distance, setDistance] = useState("");
// //   const [showZipCodeInput, setShowZipCodeInput] = useState(false);
// //   const [zipCode, setZipCode] = useState("");

// //   const getUserLocation = () => {
// //     return new Promise((resolve, reject) => {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           const { latitude, longitude } = position.coords;
// //           resolve({ latitude, longitude });
// //         },
// //         (error) => {
// //           reject(error);
// //         }
// //       );
// //     });
// //   };

// //   const handleZipCodeSubmit = async () => {
// //     // You can add validation for zip code if needed
// //     try {
// //       // const response = await axios.post("/user/facilities", { zipCode });
// //       // setFacilities(response.data);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Error fetching facilities based on zip code:", error);
// //       window.alert(error.message);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const fetchFacilities = async () => {
// //       try {
// //         const userLocation = await getUserLocation();
// //         console.log(userLocation);
// //         // const response = await axios.post("/user/facilities", { userLocation });
// //         // setFacilities(response.data);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error(
// //           "Error getting user location or fetching facilities:",
// //           error
// //         );
// //         // If user denies location access, show zip code input
// //         setShowZipCodeInput(true);
// //         setLoading(false);
// //       }
// //     };

// //     fetchFacilities();
// //   }, []);

// //   return (
// //     <div className="p-32">
// //       {showZipCodeInput ? (
// //         <div>
// //           <label htmlFor="zipCode">Enter Your Zip Code:</label>
// //           <input
// //             type="text"
// //             id="zipCode"
// //             value={zipCode}
// //             onChange={(e) => setZipCode(e.target.value)}
// //           />
// //           <button onClick={handleZipCodeSubmit}>Submit</button>
// //         </div>
// //       ) : (
// //         // Render your location content here
// //         <div>Loading...</div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Location;
