const express = require('express');
const {register, login, authenticate, userInfo, logout, getProfile, updateProfile, hero_page, messages, people, getFacilities } = require('../Controller/authController');

const route = express.Router();



route.post('/register', register);
route.post('/login', login);
route.get('/userInfo', authenticate, userInfo);
route.get('/logout', authenticate, logout);
route.get('/profile', authenticate, getProfile);
route.put('/profileupdate', authenticate, updateProfile);
route.get('/hero', authenticate, hero_page);
route.post('/facilities', authenticate, getFacilities)
route.get('/messages/:userId', authenticate, messages )
route.get('/people', authenticate, people )





module.exports = route;