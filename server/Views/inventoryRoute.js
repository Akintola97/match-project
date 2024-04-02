const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // This will store files in the 'uploads' folder temporarily
const { getAllItems, updateItems, createItems, deleteItems, adminAuthentication } = require('../Controller/adminController');
const route = express.Router();


route.get('/items', getAllItems);
route.post('/items', [adminAuthentication, upload.single('file')], createItems); 
route.put('/items/:id', [adminAuthentication, upload.single('file')], updateItems);
route.delete('/items/:id', adminAuthentication, deleteItems);

module.exports = route;
