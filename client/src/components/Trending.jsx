import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import Card from "./Card";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai"; // Import the additional icon for clearing the search field
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Trending = () => {
  const [sportsData, setSportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust the number of items per page as needed

  const fadeProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Add currentPage to the dependency array

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/sport/stories");
      setSportData(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/sport/search", { search });
      setSportData(response.data.results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sportsData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <animated.div style={fadeProps} className="w-full min-h-screen pt-[12vh] bg-gray-900">
      <form className="max-w-md mx-auto mb-8" onSubmit={searchData}>
        <div className="flex items-center border-b border-green-500 text-white">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Search sports stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="p-1"
              onClick={() => { setSearch(''); }} // Clears the search field
            >
              <AiOutlineClose className="text-lg text-white" />
            </button>
          )}
          <button type="submit" className="flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded">
            <AiOutlineSearch className="text-lg" />
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {currentItems.map((data) => (
              <Card key={data?.article_id} data={data} />
            ))}
          </div>
        </>
      )}
      <div className="flex justify-center w-full p-3">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(sportsData.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
            className="pagination-custom"
            sx={{
              "& .MuiPaginationItem-page, & .MuiPaginationItem-previous, & .MuiPaginationItem-next": {
                color: "white", // Set the color of the page number text and arrows
              },
              "& .Mui-selected, & .Mui-selected:hover, & .MuiPaginationItem-previous:hover, & .MuiPaginationItem-next:hover": {
                color: "white", // Set the color of selected, hovered, and unselected arrows
              },
            }}
          />
        </Stack>
      </div>
    </animated.div>
  );
};

export default Trending;
