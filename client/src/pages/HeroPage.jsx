import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";

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
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [animate, setAnimate] = useState(false);
  const profilesPerPage = 6;

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
      if (receivedMessage.type === "onlineUsers") {
        setOnlineUsers(receivedMessage.data.map((user) => user.userId));
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  useEffect(() => {
    fetchData();
    initializeWebSocket();

    setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);

    // Trigger animation after a delay
    setTimeout(() => {
      setAnimate(true);
    }, 800);
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleProfileClick = (userId) => {
    navigate(`/user/messages/${userId}`);
  };

  const sortedData = () => {
    switch (sortOption) {
      case "online":
        // Sort by online users first
        return data.slice().sort((a, b) => {
          const isAOnline = onlineUsers.includes(a.user);
          const isBOnline = onlineUsers.includes(b.user);

          if (isAOnline && !isBOnline) {
            return -1;
          } else if (!isAOnline && isBOnline) {
            return 1;
          } else {
            // If both online or both offline, apply other sorting criteria
            return a.firstName.localeCompare(b.firstName);
          }
        });

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

  const props = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    reset: true,
    config: { duration: 800 }, // Adjust the duration of each animation 
  });

  const titleProps = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    reset: true,
    config: { duration: 800 }, // Adjust the duration of each animation 
  });

  const sortByProps = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    reset: true,
    config: { duration: 800 }, // Adjust the duration of each animation 
  });

  const pagination = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    reset: true,
    config: { duration: 800 },
  });



  return (
    <div
      className={`flex flex-col min-h-screen bg-white ${
        isPageLoaded ? "page-loaded" : ""
      }`}
    >
      <div className="pt-20 items-center flex justify-between font-bold capitalize text-black">
      <animated.h1
          className="md:text-[2.5vmin] p-3 text-[3.5vmin]"
          style={titleProps}
        >
          Hi, {user}
        </animated.h1>
        <div>
        <animated.div style={sortByProps}>
            <div className="p-3">
              <label className="mr-2 text-green-800">Sort By:</label>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="border border-green-500 rounded p-2 bg-green-200"
              >
                <option value="online" className="text-green-800">
                  Online
                </option>
                <option value="name" className="text-green-800">
                  Name
                </option>
                <option value="age" className="text-green-800">
                  Age
                </option>
                <option value="rating" className="text-green-800">
                  Rating{" "}
                </option>
                <option value="gender" className="text-green-800">
                  Gender
                </option>
                <option value="availability" className="text-green-800">
                  Availability
                </option>
              </select>
            </div>
          </animated.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 flex-wrap">
        {data.length > 0 ? (
          currentProfiles.map((profile, index) => (
            <animated.div
            key={profile._id}
            className="bg-white p-3 m-1 rounded-2xl shadow-2xl border border-green-500"
            style={{ ...props, zIndex: currentProfiles.length - index }} // Reverse the z-index to maintain the order
            onClick={() => handleProfileClick(profile.user)}
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
              </div>
            </animated.div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {sortedData().length > profilesPerPage && (
  <div className="p-3 flex justify-center text-green-800">
    <animated.div style={pagination}>
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(sortedData().length / profilesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          style={{ color: "green" }}
        />
      </Stack>
    </animated.div>
  </div>
)}
    </div>
  );
};

export default HeroPage;
