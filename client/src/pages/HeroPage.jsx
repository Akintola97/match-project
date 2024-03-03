import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const HeroPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [dataFetched, setDataFetched] = useState(false); // New state for tracking data fetch completion
  const profilesPerPage = 6;
  const {user} = useAuth()

  const fetchData = async () => {
    try {
      const profileData = await axios.get("/user/hero");
      setData(profileData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataFetched(true); // Set to true regardless of the outcome
    }
  };

  useEffect(() => {
    fetchData();
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
    setTimeout(() => {
      setAnimate(true);
    }, 500);
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
        return data.slice().sort((a, b) => {
          const isAOnline = onlineUsers.includes(a.user);
          const isBOnline = onlineUsers.includes(b.user);
          return isAOnline === isBOnline ? a.firstName.localeCompare(b.firstName) : isAOnline ? -1 : 1;
        });
      case "age":
        return data.slice().sort((a, b) => calculateAge(a.birthdate) - calculateAge(b.birthdate));
      case "rating":
        return data.slice().sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
      case "gender":
        return data.slice().sort((a, b) => a.gender.localeCompare(b.gender));
      case "availability":
        return data.slice().sort((a, b) => a.timeToPlay.localeCompare(b.timeToPlay) || a.selectedDays.localeCompare(b.selectedDays));
      case "name":
        return data.slice().sort((a, b) => a.firstName.localeCompare(b.firstName));
      default:
        return data;
    }
  };

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = sortedData().slice(indexOfFirstProfile, indexOfLastProfile);

  const props = useSpring({ opacity: animate ? 1 : 0, from: { opacity: 0 }, reset: true, config: { duration: 500 } });
  const titleProps = useSpring({ opacity: animate ? 1 : 0, from: { opacity: 0 }, reset: true, config: { duration: 500 } });
  const sortByProps = useSpring({ opacity: animate ? 1 : 0, from: { opacity: 0 }, reset: true, config: { duration: 500 } });
  const pagination = useSpring({ opacity: animate ? 1 : 0, from: { opacity: 0 }, reset: true, config: { duration: 500 } });

  return (
    <animated.div style={props} className={`flex flex-col min-h-screen bg-gray-900 ${isPageLoaded ? "page-loaded" : ""}`}>
      <div className="pt-20 items-center flex justify-between font-bold capitalize text-white">
        <animated.h1 className="md:text-[2.5vmin] p-3 text-[3.5vmin]" style={titleProps}>
          Hi, {user}
        </animated.h1>
        <div>
          <animated.div style={sortByProps}>
            <div className="p-3">
              <label className="mr-2 text-green-800">Sort By:</label>
              <select value={sortOption} onChange={handleSortChange} className=" text-black font-semibold border border-green-500 rounded p-2 bg-green-200">
                <option value="online">Online</option>
                <option value="name">Name</option>
                <option value="age">Age</option>
                <option value="rating">Rating</option>
                <option value="gender">Gender</option>
                <option value="availability">Availability</option>
              </select>
            </div>
          </animated.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 flex-wrap">
        {dataFetched ? (
          data.length > 0 ? (
            currentProfiles.map((profile, index) => (
              <animated.div key={profile._id} className="bg-white p-3 m-1 rounded-2xl shadow-2xl border border-green-500" style={{ ...props, zIndex: currentProfiles.length - index }} onClick={() => handleProfileClick(profile.user)}>
                <h1 className="text-xl font-bold mb-2 text-center capitalize p-2 text-green-800">{profile.firstName}</h1>
                <div className="text-center">
                  <p className="p-1 text-green-800">Age: <span>{calculateAge(profile.birthdate)}</span></p>
                  <p className="p-1 text-green-800">Gender: <span>{profile.gender}</span></p>
                  <p className="p-1 text-green-800">Rating: <span>{profile.rating}</span></p>
                  <p className="p-1 text-green-800">Availability: <span className="capitalize">{profile.timeToPlay}; {profile.selectedDays}</span></p>
                  <div className="p-5 flex items-center justify-center" key={profile._id}>
                    {onlineUsers.includes(profile.user) ? <span className="ml-1 text-green-500">&#8226;</span> : <span className="ml-1 text-red-500">&#8226;</span>}
                  </div>
                </div>
              </animated.div>
            ))
          ) : (
            <div className="w-[100vw] flex justify-center items-center">
            <h1 className="text-[3vmin] font-semibold">No Profiles Available</h1>
            </div>
          )
        ) : (
          <div className="flex h-full w-[100vw] justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500">
              <p>Loading...</p>
            </div>
          </div>
        )}
      </div>
      {sortedData().length > profilesPerPage && (
<div className="p-3 flex justify-center text-white">
  <animated.div style={pagination}>
    <Stack spacing={2}>
      <Pagination
        count={Math.ceil(sortedData().length / profilesPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="secondary"
        className="pagination-custom"
        sx={{
          '& .MuiPaginationItem-page, & .MuiPaginationItem-previous, & .MuiPaginationItem-next': {
            color: 'white', // Set the color of the page number text and arrows
          },
          '& .Mui-selected, & .Mui-selected:hover, & .MuiPaginationItem-previous:hover, & .MuiPaginationItem-next:hover': {
            color: 'white', // Set the color of selected, hovered, and unselected arrows
          },
        }}
      />
    </Stack>
  </animated.div>
</div>
      
      )}
    </animated.div>
  );
};

export default HeroPage;
