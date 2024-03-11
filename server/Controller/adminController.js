const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const Items = require("../Model/Inventory");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const crypto = require('crypto');





const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});


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
    const file = req.file;
    console.log(file)
    const newItemData = req.body;
    console.log(newItemData)

    if (file) {
      const fileStream = fs.createReadStream(file.path);
      const truncatedFileName = file.originalname.substring(0, 20) + '...'
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: crypto.randomBytes(16).toString('hex') + '-' + truncatedFileName,
        Body: fileStream,
      };
      // const { Location } = await s3.send(new PutObjectCommand(uploadParams));
      // console.log(Location)
      // newItemData.imageUrl = Location;
      try {
        const response = await s3.send(new PutObjectCommand(uploadParams));
        console.log(response);
        newItemData.imageUrl = response.Location; // Check the actual property name
      } catch (error) {
        console.error("Error uploading object to S3:", error);
        // Handle the error appropriately, e.g., return an error response to the client
      }
      
    }

    const newItem = new Items(newItemData);
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
    const file = req.file;
    const updateData = req.body;
    if(file){
      const fileStream = fs.createReadStream(file.path);
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        // Key: crypto.randomBytes(35).toString('hex'),
        Key: crypto.randomBytes(16).toString('hex') + '-' + file.originalname,
        Body: fileStream,
      };
      const {Location} = await s3.send(new PutObjectCommand(uploadParams));
      updateData.imageUrl = Location;
    }
    console.log(Bucket)
    const updateItem = await Items.findByIdAndUpdate(req.params.id, updateData, {
      new:true
    });
    if(!updateItem){
      return res.status(404).send("No Update");
    }
    res.status(200).send(updateItem);
  } catch (error) {
    console.error('Error Updating Item:', error);
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
