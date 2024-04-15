const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { getAllItems, updateItems, createItems, deleteItems, adminAuthentication, getAdminProfile, adminActivateUser, adminDeactivateUser, adminDeleteUser } = require('../Controller/adminController');
const route = express.Router();


route.get('/database', adminAuthentication, getAdminProfile);
route.post('/activate/:userId', adminAuthentication, adminActivateUser);
route.post('/deactivate/:userId', adminAuthentication, adminDeactivateUser);
route.delete('/delete/:userId', adminAuthentication, adminDeleteUser);
route.get('/items', getAllItems);
route.post('/items', [adminAuthentication, upload.single('file')], createItems); 
route.put('/items/:id', [adminAuthentication, upload.single('file')], updateItems);
route.delete('/items/:id', adminAuthentication, deleteItems);

module.exports = route;
