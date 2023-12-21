import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const HeroPage = () => {
  const { user, uId } = useAuth();
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const profilesPerPage = 9;

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const profileData = await axios.get("/user/hero");
      setData(profileData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const initializeWebSocket = () => {
    const socket = new WebSocket("ws://localhost:5000/user");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (e) => {
      console.log("WebSocket message received:", e.data);
      const receivedMessage = JSON.parse(e.data);

      // if (receivedMessage.type === "onlineUsers") {
      //   const onlineUsersArray = receivedMessage.data;
      //   setOnlineUsers(onlineUsersArray);
      // }
      if(receivedMessage.type === 'onlineUsers'){
        setOnlineUsers((prevOnlineUsers)=>{
          const onlineUsersArray = receivedMessage.data
          return onlineUsersArray.map((user)=>user.userId)
        })
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    // socketRef.current = socket;
  };

  useEffect(() => {
    fetchData();
    initializeWebSocket();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleClickContact = (selectedUser) => {
    navigate(`/chat/${selectedUser}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const sortedData = () => {
    switch (sortOption) {
      case "age":
        return data
          .slice()
          .sort(
            (a, b) => calculateAge(a.birthdate) - calculateAge(b.birthdate)
          );
      case "rating":
        return data
          .slice()
          .sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
      case "gender":
        return data.slice().sort((a, b) => a.gender.localeCompare(b.gender));
      case "availability":
        return data.slice().sort((a, b) => {
          const timeToPlayComparison = a.timeToPlay.localeCompare(b.timeToPlay);
          if (timeToPlayComparison !== 0) {
            return timeToPlayComparison;
          }

          return a.selectedDays.localeCompare(b.selectedDays);
        });
      case "name":
        return data
          .slice()
          .sort((a, b) => a.firstName.localeCompare(b.firstName));
      case "":
      default:
        return data;
    }
  };

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = sortedData().slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  return (
    <div className="flex flex-col min-h-screen bg-green-100">
      <div className="pt-16 pr-3 text-[3vmin] text-right font-bold capitalize text-green-800">
        Hi, {user}
      </div>
      <div className="text-left pl-2">
        <label className="mr-2 text-green-800">Sort By:</label>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border border-green-500 rounded p-2 bg-green-200"
        >
          <option value="" className="text-green-800">
            Sort
          </option>
          <option value="name" className="text-green-800">
            Name
          </option>
          <option value="age" className="text-green-800">
            Age
          </option>
          <option value="rating" className="text-green-800">
            Rating
          </option>
          <option value="gender" className="text-green-800">
            Gender
          </option>
          <option value="availability" className="text-green-800">
            Availability
          </option>
        </select>
      </div>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
        {data.length > 0 ? (
          currentProfiles.map((profile) => (
            <div
              key={profile._id}
              className="bg-white p-3 m-1 rounded-2xl shadow-2xl transition ease-in-out hover:scale-90 border border-green-500"
            >
              <h1 className="text-xl font-bold mb-2 text-center capitalize p-2 text-green-800">
                {profile.firstName}
              </h1>
              <div className="text-center">
                <p className="p-1 text-green-800">
                  Age:{" "}
                  <span className="">{calculateAge(profile.birthdate)}</span>
                </p>
                <p className="p-1 text-green-800">
                  Gender: <span className="">{profile.gender}</span>
                </p>
                <p className="p-1 text-green-800">
                  Rating: <span className="">{profile.rating}</span>
                </p>
                <p className="p-1 text-green-800">
                  Availability:{" "}
                  <span className="capitalize text-green-800">
                    {profile.timeToPlay}; {profile.selectedDays}
                  </span>
                </p>
                <div
                  className="p-5 flex items-center justify-center"
                  key={profile._id}
                >
                  {/* <button
                    onClick={() => handleClickContact(profile)}
                    className="bg-green-500 hover:bg-green-800 text-white w-2/3 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-green active:bg-green-700 ml-2"
                  >
                    <h1>Contact</h1>
                  </button> */}
                  {onlineUsers.includes(profile.user) ? (
                    <span className="ml-1 text-green-500">&#8226;</span>
                  ) : (
                    <span className="ml-1 text-red-500">&#8226;</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {sortedData().length > profilesPerPage && (
        <div className="p-3 flex justify-center">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(sortedData().length / profilesPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default HeroPage;
