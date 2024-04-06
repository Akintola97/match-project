const express = require("express");
const {
  register,
  login,
  authenticate,
  userInfo,
  logout,
  getProfile,
  updateProfile,
  hero_page,
  // messages,
  people,
  deleteOrDeactivateUser,
  activate,
  addToCart,
  getCart,
  removeFromCart,
} = require("../Controller/authController");

const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.get("/userinfo", authenticate, userInfo);
route.get("/logout", authenticate, logout);
route.get("/profile", authenticate, getProfile);
route.put("/profileupdate", authenticate, updateProfile);
route.post("/profile/:action", authenticate, deleteOrDeactivateUser);
route.put("/profile/activate", authenticate, activate);
route.get("/hero", authenticate, hero_page);
// route.post('/facilities', authenticate, getFacilities)
// route.get('/messages/:userId', authenticate, messages )
route.get("/people", authenticate, people);
route.post("/cart/add", authenticate, addToCart); 
route.get("/cart", authenticate, getCart); 
route.put("/cart/update", authenticate, addToCart); 
route.delete("/cart/item/:itemId", authenticate, removeFromCart);



module.exports = route;
