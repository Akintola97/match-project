import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import Card from "./Card";
import { AiOutlineSearch } from "react-icons/ai";

const Trending = () => {
  const [sportsData, setSportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fadeProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  useEffect(() => {
    fetchData();
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {sportsData.map((data) => (
            <Card key={data?.article_id} data={data} />
          ))}
        </div>
      )}
    </animated.div>
  );
};

export default Trending;
