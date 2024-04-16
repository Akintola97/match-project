import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  AccessTime,
  StarRate,
  Wc,
  CalendarToday,
  PersonOutline,
} from "@mui/icons-material";

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
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const profilesPerPage = 6;
  const { user } = useAuth();

  useEffect(() => {
    const ws = new WebSocket("wss://localhost:10001/user");

    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === "onlineUsers") {
        setOnlineUsers(message.data.map((user) => user.userId));
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchData = async () => {
    try {
      const profileData = await axios.get("/user/hero");
      setData(profileData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataFetched(true);
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
          return isAOnline === isBOnline
            ? a.firstName.localeCompare(b.firstName)
            : isAOnline
            ? -1
            : 1;
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
        return data
          .slice()
          .sort(
            (a, b) =>
              a.timeToPlay.localeCompare(b.timeToPlay) ||
              a.selectedDays.localeCompare(b.selectedDays)
          );
      case "name":
        return data
          .slice()
          .sort((a, b) => a.firstName.localeCompare(b.firstName));
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
    reset: false,
    config: { duration: 500 },
  });
  const titleProps = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    reset: false,
    config: { duration: 500 },
  });
  const sortByProps = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    reset: false,
    config: { duration: 500 },
  });
  const pagination = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    reset: false,
    config: { duration: 500 },
  });

  return (
    <animated.div
      style={props}
      className={`flex flex-col min-h-screen bg-gray-900 ${
        isPageLoaded ? "page-loaded" : ""
      }`}
    >
      <div className="pt-20 items-center flex justify-between font-bold capitalize text-white">
        <animated.h1
          className="md:text-[2.5vmin] p-3 text-[3.5vmin]"
          style={titleProps}
        >
          Hi, {user}
        </animated.h1>
        <div>
          <animated.div style={sortByProps}>
            <FormControl
              variant="outlined"
              className="mr-4"
              style={{
                minWidth: 200,
                margin: "0 20px",
                backgroundColor: "transparent",
                color: "black",
              }}
            >
              <InputLabel id="sort-by-label" style={{ color: "white" }}>
                Sort By
              </InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value={sortOption}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="age">Age</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="gender">Gender</MenuItem>
                <MenuItem value="availability">Availability</MenuItem>
              </Select>
            </FormControl>
          </animated.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 flex-wrap">
        {dataFetched ? (
          data.length > 0 ? (
            currentProfiles.map((profile, index) => (
              <Card
                key={profile._id}
                sx={{
                  minWidth: 275,
                  background: "#fff",
                  m: 1,
                  borderRadius: "16px",
                  boxShadow: "5px 5px 20px rgba(0,0,0,0.1)",
                }}
                onClick={() => handleProfileClick(profile.user)}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    align="center"
                  >
                    {profile.firstName}
                  </Typography>
                  <Typography sx={{ fontSize: 14, p: 1 }} variant="body2">
                    <PersonOutline sx={{ fontSize: 30 }} /> {profile.gender}
                  </Typography>
                  <Typography sx={{ fontSize: 14, p: 1 }} variant="body2">
                    <CalendarToday sx={{ fontSize: 30 }} /> Age:{" "}
                    {calculateAge(profile.birthdate)}
                  </Typography>
                  <Typography sx={{ fontSize: 14, p: 1 }} variant="body2">
                    <StarRate sx={{ fontSize: 30 }} /> Rating: {profile.rating}
                  </Typography>
                  <Typography
                    className="capitalize"
                    sx={{ fontSize: 14, p: 1 }}
                    variant="body2"
                  >
                    <AccessTime sx={{ fontSize: 30 }} /> Availability:{" "}
                    {profile.timeToPlay}; {profile.selectedDays}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      sx={{ fontSize: 15, p: 2, mt: 2 }}
                      icon={onlineUsers.includes(profile.user) ? <Wc /> : null}
                      label={
                        onlineUsers.includes(profile.user)
                          ? "Online"
                          : "Offline"
                      }
                      color={
                        onlineUsers.includes(profile.user)
                          ? "success"
                          : "default"
                      }
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="w-[100vw] flex justify-center items-center">
              <h1 className="text-[3vmin] font-semibold">
                No Profiles Available
              </h1>
            </div>
          )
        ) : (
          <div className="flex h-full w-[100vw] justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
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
                  "& .MuiPaginationItem-page, & .MuiPaginationItem-previous, & .MuiPaginationItem-next":
                    { color: "white" },
                  "& .Mui-selected, & .Mui-selected:hover, & .MuiPaginationItem-previous:hover, & .MuiPaginationItem-next:hover":
                    { color: "white" },
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
