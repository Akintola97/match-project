const axios = require("axios");
const apiKey = process.env.API_KEY;
require("dotenv").config();

exports.news_trending = async (req, res) => {
  const trending_data = await axios.get(
    `https://newsdata.io/api/1/news?qInTitle=tennis&category=sports,top&language=en&image=1&full_content=1&size=9&apikey=${apiKey}`
  );
  const response = trending_data.data;
  res.send(response);
};

exports.search = async (req, res) => {
  const { search } = req.body;
  try {
    const search_data = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&qInTitle=${search}&category=sports,top&language=en&image=1&size=9&full_content=1`
    );
    res.send(search_data.data);
  } catch (error) {
    console.log(error);
  }
};
