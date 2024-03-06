const express = require('express');
const { getAllItems, updateItems, createItems, deleteItems } = require('../Controller/adminController');
const route = express.Router();



route.get('/items', adminAuthentication, getAllItems)
route.post('/items', adminAuthentication, updateItems)
route.put('/items/:id', adminAuthentication, createItems)
route.delete('/items/:id', adminAuthentication, deleteItems)



module.exports = adminRouter;
