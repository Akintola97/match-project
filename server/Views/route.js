const express = require('express');
const {register, login, authenticate, userInfo, logout, getProfile, updateProfile, hero_page, messages } = require('../Controller/authController');

const route = express.Router();



route.post('/register', register);
route.post('/login', login);
route.get('/userInfo', authenticate, userInfo);
route.get('/logout', authenticate, logout);
route.get('/profile', authenticate, getProfile);
route.put('/profileupdate', authenticate, updateProfile);
route.get('/hero', authenticate, hero_page);
route.get('/messages/:userId', authenticate, messages )





module.exports = route;