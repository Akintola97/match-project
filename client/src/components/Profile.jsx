// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   CalendarIcon,
//   MailIcon,
//   UserCircleIcon,
//   ChevronDownIcon,
//   StarIcon,
//   ClockIcon,
// } from "@heroicons/react/solid";

// const Profile = () => {
//   const [firstName, setFirstName] = useState("");
//   const [email, setEmail] = useState("");
//   const [rating, setRating] = useState("");
//   const [timeToPlay, setTimeToPlay] = useState("");
//   const [selectedDays, setSelectedDays] = useState([]);
//   const [gender, setGender] = useState("");
//   const [backupEmail, setBackupEmail] = useState("");
//   const [newBackupEmail, setNewBackupEmail] = useState("");
//   const [birthdate, setBirthdate] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get("/user/profile");
//         const profileData = response.data;

//         const defaultBirthdate = profileData.birthdate
//           ? profileData.birthdate.split("T")[0]
//           : "";
//         setBirthdate(defaultBirthdate);

//         setFirstName(profileData.firstName);
//         setEmail(profileData.email);
//         setRating(profileData.rating);
//         setTimeToPlay(profileData.timeToPlay);
//         setSelectedDays(profileData.selectedDays.split(","));
//         setBackupEmail(profileData.backupEmail);
//         setGender(profileData.gender);
//         setNewBackupEmail(profileData.backupEmail);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (selectedDays.length === 0) {
//       alert("Select at least one day as available to play");
//       return;
//     }

//     const updatedProfileData = {
//       firstName,
//       email,
//       rating,
//       timeToPlay,
//       selectedDays: selectedDays.join(","),
//       gender,
//       birthdate,
//       backupEmail: newBackupEmail,
//     };

//     try {
//       const response = await axios.put(
//         "/user/profileupdate",
//         updatedProfileData
//       );
//       if (response.data.message === "Profile updated successfully") {
//         setEmail(response.data.email);
//         navigate("/hero");
//       }
//     } catch (error) {
//       console.error("Profile update error:", error.message);
//       window.alert(error.message);
//     }
//   };

//   const daysOfWeek = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   const handleDayChange = (day) => {
//     const updatedSelectedDays = selectedDays.includes(day)
//       ? selectedDays.filter((d) => d !== day)
//       : [...selectedDays, day];
//     setSelectedDays(updatedSelectedDays);
//   };

//   return (
//     <div className="flex flex-col h-screen w-full mx-auto bg-gray-900 text-gray-200 pt-[12vh]">
//       <form
//         className="bg-gray-900 shadow-lg rounded-lg p-8"
//         onSubmit={handleSubmit}
//       >
//         <h1 className="text-3xl font-bold text-center mb-10">
//           Profile Settings
//         </h1>
//         <div className="w-full md:grid md:grid-cols-2 md:gap-6">
//           <div className="mb-6">
//             <label className="block mb-2 font-medium">First Name:</label>
//             <div className="flex items-center">
//               <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
//               <input
//                 className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
//                 type="text"
//                 placeholder="First Name"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium">Email:</label>
//             <div className="flex items-center">
//               <MailIcon className="h-5 w-5 mr-2 text-gray-400" />
//               <input
//                 className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium">Alternate Email:</label>
//             <div className="flex items-center">
//               <MailIcon className="h-5 w-5 mr-2 text-gray-400" />
//               <input
//                 className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
//                 type="email"
//                 placeholder="Alternate Email"
//                 value={newBackupEmail}
//                 onChange={(e) => setNewBackupEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium">Birthdate:</label>
//             <div className="flex items-center">
//               <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
//               <input
//                 type="date"
//                 className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
//                 value={birthdate}
//                 onChange={(e) => setBirthdate(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium">Gender:</label>
//             <div className="flex items-center">
//               <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-400" />
//               <select
//                 className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium">Rating:</label>
//             <div className="flex items-center">
//               <StarIcon className="h-5 w-5 mr-2 text-gray-400" />
//               <select
//                 className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//                 required
//               >
//                 <option value="">Select Rating</option>
//                 <option value="1.5-2.0">1.5-2.0</option>
//                 <option value="2.5-3.0">2.5-3.0</option>
//                 <option value="3.5-4.0">3.5-4.0</option>
//                 <option value="4.5+">4.5+</option>
//               </select>
//             </div>
//           </div>
//           <div className="mb-6 col-span-2">
//             <label className="block mb-2 font-medium">
//               Days Available to Play:
//             </label>
//             <div className="flex flex-wrap">
//               {daysOfWeek.map((day, index) => (
//                 <label key={index} className="flex items-center m-2">
//                   <input
//                     type="checkbox"
//                     value={day}
//                     checked={selectedDays.includes(day)}
//                     onChange={() => handleDayChange(day)}
//                     className="mr-2"
//                   />
//                   {day}
//                 </label>
//               ))}
//             </div>
//           </div>
//           <div className="mb-6 col-span-2">
//             <label className="block mb-2 font-medium">
//               Time Looking to Play:
//             </label>
//             <div className="flex items-center">
//               <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
//               <select
//                 className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
//                 name="timeToPlay"
//                 value={timeToPlay}
//                 onChange={(e) => setTimeToPlay(e.target.value)}
//                 required
//               >
//                 <option value="">Select Time</option>
//                 <option value="morning">6-11am</option>
//                 <option value="afternoon">12-4pm</option>
//                 <option value="evening">5-9pm</option>
//               </select>
//             </div>
//           </div>
//         </div>
//         <div className="mt-6">
//           <button
//             className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
//             type="submit"
//           >
//             Save Profile
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  MailIcon,
  UserCircleIcon,
  ChevronDownIcon,
  StarIcon,
  ClockIcon,
  TrashIcon,
  BanIcon, // New import for the deactivate button icon
} from "@heroicons/react/solid";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState("");
  const [timeToPlay, setTimeToPlay] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [gender, setGender] = useState("");
  const [backupEmail, setBackupEmail] = useState("");
  const [newBackupEmail, setNewBackupEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/user/profile");
        const profileData = response.data;

        const defaultBirthdate = profileData.birthdate
          ? profileData.birthdate.split("T")[0]
          : "";
        setBirthdate(defaultBirthdate);

        setFirstName(profileData.firstName);
        setEmail(profileData.email);
        setRating(profileData.rating);
        setTimeToPlay(profileData.timeToPlay);
        setSelectedDays(profileData.selectedDays.split(","));
        setBackupEmail(profileData.backupEmail);
        setGender(profileData.gender);
        setNewBackupEmail(profileData.backupEmail);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDays.length === 0) {
      alert("Select at least one day as available to play");
      return;
    }

    const updatedProfileData = {
      firstName,
      email,
      rating,
      timeToPlay,
      selectedDays: selectedDays.join(","),
      gender,
      birthdate,
      backupEmail: newBackupEmail,
    };

    try {
      const response = await axios.put(
        "/user/profileupdate",
        updatedProfileData
      );
      if (response.data.message === "Profile updated successfully") {
        setEmail(response.data.email);
        navigate("/hero");
      }
    } catch (error) {
      console.error("Profile update error:", error.message);
      window.alert(error.message);
    }
  };

  const handleDeleteOrDeactivateProfile = async (action) => {
    try {
      await axios.post(`/user/profile/${action}`);
      alert(`Profile ${action === 'delete' ? 'deleted' : 'deactivated'} successfully.`);
      navigate("/login"); // Adjust as necessary
    } catch (error) {
      console.error(`Error trying to ${action} the profile:`, error);
      alert(`Error trying to ${action} the profile.`);
    }
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleDayChange = (day) => {
    const updatedSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updatedSelectedDays);
  };

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-gray-900 text-gray-200 pt-[12vh]">
      <form
        className="bg-gray-900 shadow-lg rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center mb-10">Profile Settings</h1>
        <div className="w-full md:grid md:grid-cols-2 md:gap-6">
          <div className="mb-6">
            <label className="block mb-2 font-medium">First Name:</label>
            <div className="flex items-center">
              <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
              <input
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Email:</label>
            <div className="flex items-center">
              <MailIcon className="h-5 w-5 mr-2 text-gray-400" />
              <input
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Alternate Email:</label>
            <div className="flex items-center">
              <MailIcon className="h-5 w-5 mr-2 text-gray-400" />
              <input
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                type="email"
                placeholder="Alternate Email"
                value={newBackupEmail}
                onChange={(e) => setNewBackupEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Birthdate:</label>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
              <input
                type="date"
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Gender:</label>
            <div className="flex items-center">
              <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-400" />
              <select
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Rating:</label>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 mr-2 text-gray-400" />
              <select
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              >
                <option value="">Select Rating</option>
                <option value="1.5-2.0">1.5-2.0</option>
                <option value="2.5-3.0">2.5-3.0</option>
                <option value="3.5-4.0">3.5-4.0</option>
                <option value="4.5+">4.5+</option>
              </select>
            </div>
          </div>
          <div className="mb-6 col-span-2">
            <label className="block mb-2 font-medium">Days Available to Play:</label>
            <div className="flex flex-wrap">
              {daysOfWeek.map((day, index) => (
                <label key={index} className="flex items-center m-2">
                  <input
                    type="checkbox"
                    value={day}
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayChange(day)}
                    className="mr-2"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6 col-span-2">
            <label className="block mb-2 font-medium">Time Looking to Play:</label>
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
              <select
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                name="timeToPlay"
                value={timeToPlay}
                onChange={(e) => setTimeToPlay(e.target.value)}
                required
              >
                <option value="">Select Time</option>
                <option value="morning">Morning (6-11am)</option>
                <option value="afternoon">Afternoon (12-4pm)</option>
                <option value="evening">Evening (5-9pm)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            type="submit"
          >
            Save Profile
          </button>
        </div>
        {/* New Buttons for Delete and Deactivate */}
        <div className="flex justify-between mt-8">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            type="button"
            onClick={() => handleDeleteOrDeactivateProfile('delete')}
          >
            <TrashIcon className="inline-block h-5 w-5 mr-2"/> Delete Profile
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            type="button"
            onClick={() => handleDeleteOrDeactivateProfile('deactivate')}
          >
            <BanIcon className="inline-block h-5 w-5 mr-2"/> Deactivate Profile
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default Profile;
