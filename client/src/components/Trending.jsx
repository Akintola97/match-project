import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { AiOutlineSearch } from "react-icons/ai";

const Trending = () => {
  const [sportsData, setSportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sportsData = await axios.get("/sport/stories");
      const data = sportsData.data.results;
      setSportData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const searchData = async (e) => {
    e.preventDefault();
    setSearch("");

    try {
      const response = await axios.post("/sport/search", { search });
      const searchData = response.data.results;
      setSportData(searchData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full pt-20 bg-green-100">
      <form className="pr-3 text-right" onSubmit={searchData}>
        <input
          className="bg-transparent focus:outline-none border-b text-black cursor-pointer"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="text-white bg-green-500 rounded-md p-1.5">
          <AiOutlineSearch className="text-[2.0vmin]" />
        </button>
      </form>

      {loading && <p className="text-center mt-5">Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {sportsData.map((data) => (
          <Card key={data?.article_id} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Trending;
