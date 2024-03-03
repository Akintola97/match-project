// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [firstName, setFirstName] = useState("");
//   const [email, setEmail] = useState("");
//   const [rating, setRating] = useState("");
//   const [timeToPlay, setTimeToPlay] = useState("");
//   const [selectedDays, setSelectedDays] = useState("");
//   const [gender, setGender] = useState("");
//   const [backupEmail, setBackupEmail] = useState("");
//   const [newBackupEmail, setNewBackupEmail] = useState("");
//   const [birthdate, setBirthdate] = useState(new Date());

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get("/user/profile");
//         const profileData = response.data;

//         const defaultBirthdate = profileData.birthdate
//           ? new Date(profileData.birthdate)
//           : new Date();
//         setBirthdate(defaultBirthdate);

//         setFirstName(profileData.firstName);
//         setEmail(profileData.email);
//         setRating(profileData.rating);
//         setTimeToPlay(profileData.timeToPlay);
//         setSelectedDays(profileData.selectedDays);
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
//       selectedDays,
//       gender,
//       birthdate: birthdate.toISOString(),
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

//   return (
//     <div className="flex flex-col h-full">
//       <form
//         className="bg-gray-900 opacity-90 md:mt-0 pt-14 pb-10 shadow-md w-full rounded px-8"
//         onSubmit={handleSubmit}
//       >
//         <div className="mb-3">
//           <h1 className="w-full h-full text-4xl text-center p-5 font-bold text-white">
//             Profile
//           </h1>
//           <label className="block text-white text-sm font-bold mb-2">
//             First Name:
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
//             type="text"
//             placeholder="First Name"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="block text-white text-sm font-bold mb-2">
//             Email:
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="block text-white text-sm font-bold mb-2">
//             Alternate Email:
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
//             type="email"
//             placeholder="Alternate Email"
//             value={newBackupEmail}
//             onChange={(e) => setNewBackupEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="block text-white text-sm font-bold mb-2">
//             Birthdate:
//           </label>
//           <input
//             type="date"
//             className="p-2 border rounded w-full"
//             value={
//               birthdate instanceof Date
//                 ? birthdate.toISOString().split("T")[0]
//                 : ""
//             }
//             onChange={(e) => setBirthdate(new Date(e.target.value))}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="block text-white text-sm font-bold mb-2">
//             Gender:
//           </label>
//           <select
//             className="p-2 border rounded w-full text-green-800"
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//             required
//           >
//             <option value="" className="text-white opacity-50">
//               Select Gender
//             </option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>
//         <div className="">
//           <label className="block text-white text-sm font-bold mb-2">
//             Rating:
//           </label>
//           <select
//             className="p-2 border rounded w-full text-green-800"
//             value={rating}
//             onChange={(e) => setRating(e.target.value)}
//             required
//           >
//             <option value="" className="text-white opacity-50">
//               Select Rating
//             </option>
//             <option value="1.5-2.0">1.5-2.0</option>
//             <option value="2.5-3.0">2.5-3.0</option>
//             <option value="3.5-4.0">3.5-4.0</option>
//             <option value="4.5+">4.5+</option>
//           </select>
//         </div>
//         <div className="mb-3 mt-4">
//           <label className="block text-white text-sm font-bold">
//             Days available to play:
//           </label>
//           <div className="flex text-white flex-wrap">
//             {daysOfWeek.map((day) => (
//               <label key={day} className="m-2">
//                 <input
//                   type="checkbox"
//                   value={day}
//                   checked={selectedDays.includes(day)}
//                   onChange={() => {
//                     const updatedSelectedDays = selectedDays.includes(day)
//                       ? selectedDays
//                           .split(",")
//                           .filter((d) => d !== day)
//                           .join(",")
//                       : selectedDays.length > 0
//                       ? `${selectedDays},${day}`
//                       : day;

//                     setSelectedDays(updatedSelectedDays);
//                   }}
//                   className="mr-2"
//                 />
//                 {day}
//               </label>
//             ))}
//           </div>
//         </div>
//         <div className="mb-3">
//           <label className="block text-white text-sm font-bold mb-2">
//             Time Looking to Play:
//           </label>
//           <select
//             className="p-2 border rounded w-full text-green-800"
//             name="timeToPlay"
//             value={timeToPlay}
//             onChange={(e) => setTimeToPlay(e.target.value)}
//             required
//           >
//             <option value="">Play Time</option>
//             <option value="morning">6-11am</option>
//             <option value="afternoon">12-4pm</option>
//             <option value="evening">5-9pm</option>
//           </select>
//         </div>
//         <div className="flex items-center justify-between mt-9">
//           <button
//             className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
  CheckCircleIcon,
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
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <form
        className="bg-white shadow-lg rounded-lg p-8 mt-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Profile Settings
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-6">
            <label className="block mb-2 text-gray-600 font-medium">
              First Name:
            </label>
            <div className="flex items-center">
              <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-600 font-medium">
              Email:
            </label>
            <div className="flex items-center">
              <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-600 font-medium">
              Alternate Email:
            </label>
            <div className="flex items-center">
              <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                type="email"
                placeholder="Alternate Email"
                value={newBackupEmail}
                onChange={(e) => setNewBackupEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-600 font-medium">
              Birthdate:
            </label>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-600 font-medium">
              Gender:
            </label>
            <div className="flex items-center">
              <ChevronDownIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
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
            <label className="block mb-2 text-gray-600 font-medium">
              Rating:
            </label>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
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
            <label className="block mb-2 text-gray-600 font-medium">
              Days Available to Play:
            </label>
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
            <label className="block mb-2 text-gray-600 font-medium">
              Time Looking to Play:
            </label>
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full border rounded-lg py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                name="timeToPlay"
                value={timeToPlay}
                onChange={(e) => setTimeToPlay(e.target.value)}
                required
              >
                <option value="">Select Time</option>
                <option value="morning">6-11am</option>
                <option value="afternoon">12-4pm</option>
                <option value="evening">5-9pm</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            type="submit"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
