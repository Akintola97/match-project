const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const Items = require("../Model/Inventory");
const User = require("../Model/User");


exports.adminAuthentication = (req, res, next) => {
  const adminToken = req.cookies.authToken;
  if (!adminToken) {
    return res.status(403).send("Access Denied");
  }
  try {
    const decodedToken = jwt.verify(adminToken, secret);
    req.user = decodedToken;
    if (req.user.role !== "admin")
      return res.status(403).send("Access Denied: Admin Only");
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

exports.createItems = async (req, res) => {
  try {
    const newItem = new Items(req.body);
    await newItem.save();
    res.status(200).send(newItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Items.find({});
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateItems = async (req, res) => {
  try {
    const updateItem = await Items.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateItem) return res.status(404).send("Items not found.");
    res.status(200).send(updateItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteItems = async (req, res) => {
  try {
    const item = await Items.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(401).send("Items not found.");
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
