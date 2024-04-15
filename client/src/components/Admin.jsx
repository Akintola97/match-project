import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import {
  Container,
  Typography,
  Grid,
  Stack,
  Pagination,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import AdminDatabaseCard from "./AdminDatabaseCard";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const itemsPerPageOptions = [2, 4, 8, 12, 16];

  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/admin/database");
      setUsers(response.data);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log(users)

  const handleToggleActive = async (userId, currentIsActive) => {
    const endpoint = currentIsActive
      ? `/admin/deactivate/${userId}`
      : `/admin/activate/${userId}`;

    try {
      const response = await axios.post(endpoint);
      alert(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("An error occurred while updating the user:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while updating the user."
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/admin/delete/${userId}`);
      alert(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("An error occurred while deleting the user:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while deleting the user."
      );
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = searchQuery
    ? users.filter((user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <animated.div
      style={props}
      className="flex flex-col min-h-screen pt-[12vh] bg-gray-900"
    >
      <Container maxWidth="lg">
        <Typography
          className="text-center text-white p-3"
          variant="h4"
          gutterBottom
        >
          Admin Dashboard
        </Typography>
        <div className="flex justify-between items-center mb-3">
          <TextField
            label="Search Users by Name"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: "85%",
              backgroundColor: "white",
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
              },
              "& .MuiFormLabel-root": {
                color: "black",
              },
            }}
          />
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            variant="outlined"
            sx={{
              minWidth: 90,
              backgroundColor: "white",
              textAlign: "center",
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
              },
            }}
          >
            {itemsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </div>
        <Grid container p={3} spacing={3}>
          {dataFetched && currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <Grid item xs={12} sm={6} md={6} key={user._id}>
                <AdminDatabaseCard
                  user={user}
                  handleToggleActive={handleToggleActive}
                  handleDeleteUser={handleDeleteUser}
                />
              </Grid>
            ))
          ) : (
            <Typography>No users found.</Typography>
          )}
        </Grid>
        {dataFetched && filteredUsers.length > itemsPerPage && (
          <Stack spacing={2} alignItems="center" marginY={5}>
            <Pagination
              count={Math.ceil(filteredUsers.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              sx={{
                "& .MuiPaginationItem-page, & .MuiPaginationItem-previous, & .MuiPaginationItem-next":
                  {
                    color: "white",
                  },
                "& .Mui-selected, & .Mui-selected:hover, & .MuiPaginationItem-previous:hover, & .MuiPaginationItem-next:hover":
                  {
                    color: "white",
                  },
              }}
            />
          </Stack>
        )}
      </Container>
    </animated.div>
  );
};

export default Admin;
