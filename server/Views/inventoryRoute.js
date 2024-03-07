const express = require('express');
const { getAllItems, updateItems, createItems, deleteItems, adminAuthentication } = require('../Controller/adminController');
const route = express.Router();

// route.get('/info', adminAuthentication, adminUserInfo )
// route.get('/items', adminAuthentication, getAllItems)
// route.post('/items', adminAuthentication, updateItems)
// route.put('/items/:id', adminAuthentication, createItems)
// route.delete('/items/:id', adminAuthentication, deleteItems)

route.get('/items', adminAuthentication, getAllItems);
route.post('/items', adminAuthentication, createItems);
route.put('/items/:id', adminAuthentication, updateItems);
route.delete('/items/:id', adminAuthentication, deleteItems);



module.exports = route;
