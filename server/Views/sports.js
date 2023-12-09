const express = require('express');
const { news_trending, search } = require('../Controller/newsController');
const { authenticate } = require('../Controller/authController');
const sport_route = express.Router();



sport_route.get('/stories', authenticate, news_trending);
sport_route.post('/search', authenticate, search);




module.exports = sport_route